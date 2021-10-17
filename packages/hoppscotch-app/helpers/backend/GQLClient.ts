import {
  ref,
  reactive,
  Ref,
  unref,
  watchEffect,
  watchSyncEffect,
  WatchStopHandle,
} from "@nuxtjs/composition-api"
import {
  createClient,
  TypedDocumentNode,
  OperationResult,
  dedupExchange,
  OperationContext,
  fetchExchange,
  makeOperation,
  GraphQLRequest,
  createRequest,
} from "@urql/core"
import { authExchange } from "@urql/exchange-auth"
import { offlineExchange } from "@urql/exchange-graphcache"
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage"
import { devtoolsExchange } from "@urql/devtools"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe, constVoid } from "fp-ts/function"
import { Source, subscribe, pipe as wonkaPipe, onEnd } from "wonka"
import { keyDefs } from "./caching/keys"
import { optimisticDefs } from "./caching/optimistic"
import { updatesDef } from "./caching/updates"
import { resolversDef } from "./caching/resolvers"
import schema from "./backend-schema.json"
import {
  getAuthIDToken,
  probableUser$,
  waitProbableLoginToConfirm,
} from "~/helpers/fb/auth"

const BACKEND_GQL_URL =
  process.env.CONTEXT === "production"
    ? "https://api.hoppscotch.io/graphql"
    : "https://api.hoppscotch.io/graphql"

const storage = makeDefaultStorage({
  idbName: "hoppcache-v1",
  maxAge: 7,
})

export const client = createClient({
  url: BACKEND_GQL_URL,
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    offlineExchange({
      schema: schema as any,
      keys: keyDefs,
      optimistic: optimisticDefs,
      updates: updatesDef,
      resolvers: resolversDef,
      storage,
    }),
    authExchange({
      addAuthToOperation({ authState, operation }) {
        if (!authState || !authState.authToken) {
          return operation
        }

        const fetchOptions =
          typeof operation.context.fetchOptions === "function"
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {}

        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              Authorization: `Bearer ${authState.authToken}`,
            },
          },
        })
      },
      willAuthError({ authState }) {
        return !authState || !authState.authToken
      },
      getAuth: async () => {
        if (!probableUser$.value) return { authToken: null }

        await waitProbableLoginToConfirm()

        return {
          authToken: getAuthIDToken(),
        }
      },
    }),
    fetchExchange,
  ],
})

type MaybeRef<X> = X | Ref<X>

type UseQueryOptions<T = any, V = object> = {
  query: TypedDocumentNode<T, V>
  variables?: MaybeRef<V>

  defer?: boolean
}

/**
 * A wrapper type for defining errors possible in a GQL operation
 */
export type GQLError<T extends string> =
  | {
      type: "network_error"
      error: Error
    }
  | {
      type: "gql_error"
      error: T
    }

export const useGQLQuery = <DocType, DocVarType, DocErrorType extends string>(
  _args: UseQueryOptions<DocType, DocVarType>
) => {
  const stops: WatchStopHandle[] = []

  const args = reactive(_args)

  const loading: Ref<boolean> = ref(true)
  const isStale: Ref<boolean> = ref(true)
  const data: Ref<E.Either<GQLError<DocErrorType>, DocType>> = ref() as any

  const isPaused: Ref<boolean> = ref(args.defer ?? false)

  const request: Ref<GraphQLRequest<DocType, DocVarType>> = ref(
    createRequest<DocType, DocVarType>(
      args.query,
      unref<DocVarType>(args.variables as any) as any
    )
  ) as any

  const source: Ref<Source<OperationResult> | undefined> = ref()

  stops.push(
    watchEffect(
      () => {
        const newRequest = createRequest<DocType, DocVarType>(
          args.query,
          unref<DocVarType>(args.variables as any) as any
        )

        if (request.value.key !== newRequest.key) {
          request.value = newRequest
        }
      },
      { flush: "pre" }
    )
  )

  stops.push(
    watchEffect(
      () => {
        source.value = !isPaused.value
          ? client.executeQuery<DocType, DocVarType>(request.value, {
              requestPolicy: "cache-and-network",
            })
          : undefined
      },
      { flush: "pre" }
    )
  )

  watchSyncEffect((onInvalidate) => {
    if (source.value) {
      loading.value = true
      isStale.value = false

      onInvalidate(
        wonkaPipe(
          source.value,
          onEnd(() => {
            loading.value = false
            isStale.value = false
          }),
          subscribe((res) => {
            data.value = pipe(
              // The target
              res.data as DocType | undefined,
              // Define what happens if data does not exist (it is an error)
              E.fromNullable(
                pipe(
                  // Take the network error value
                  res.error?.networkError,
                  // If it null, set the left to the generic error name
                  E.fromNullable(res.error?.message),
                  E.match(
                    // The left case (network error was null)
                    (gqlErr) =>
                      <GQLError<DocErrorType>>{
                        type: "gql_error",
                        error: gqlErr as DocErrorType,
                      },
                    // The right case (it was a GraphQL Error)
                    (networkErr) =>
                      <GQLError<DocErrorType>>{
                        type: "network_error",
                        error: networkErr,
                      }
                  )
                )
              )
            )

            loading.value = false
          })
        ).unsubscribe
      )
    }
  })

  const execute = (updatedVars?: DocVarType) => {
    if (updatedVars) {
      args.variables = updatedVars as any
    }

    isPaused.value = false
  }

  const response = reactive({
    loading,
    data,
    isStale,
    execute,
  })

  watchEffect(() => {
    console.log(JSON.stringify(response))
  })

  return response
}

export const runMutation = <
  DocType,
  DocVariables extends object | undefined,
  DocErrors extends string
>(
  mutation: TypedDocumentNode<DocType, DocVariables>,
  variables?: DocVariables,
  additionalConfig?: Partial<OperationContext>
): TE.TaskEither<GQLError<DocErrors>, DocType> =>
  pipe(
    TE.tryCatch(
      () =>
        client
          .mutation(mutation, variables, {
            requestPolicy: "cache-and-network",
            ...additionalConfig,
          })
          .toPromise(),
      () => constVoid() as never // The mutation function can never fail, so this will never be called ;)
    ),
    TE.chainEitherK((result) =>
      pipe(
        result.data,
        E.fromNullable(
          // Result is null
          pipe(
            result.error?.networkError,
            E.fromNullable(result.error?.name),
            E.match(
              // The left case (network error was null)
              (gqlErr) =>
                <GQLError<DocErrors>>{
                  type: "gql_error",
                  error: gqlErr,
                },
              // The right case (it was a network error)
              (networkErr) =>
                <GQLError<DocErrors>>{
                  type: "network_error",
                  error: networkErr,
                }
            )
          )
        )
      )
    )
  )
