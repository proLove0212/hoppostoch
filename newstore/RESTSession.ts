import { pluck, distinctUntilChanged } from "rxjs/operators"
import DispatchingStore, { defineDispatchers } from "./DispatchingStore"
import { HoppRESTParam, HoppRESTRequest } from "~/helpers/types/HoppRESTRequest"

function getParamsInURL(url: string): { key: string; value: string }[] {
  const result: { key: string; value: string }[] = []

  try {
    const uriObj = new URL(url)

    uriObj.searchParams.forEach((value, key) => {
      result.push({ key, value })
    })
  } catch (_e) {}

  return result
}

function recalculateParams(
  oldURL: string,
  currentParams: HoppRESTParam[],
  newParams: { key: string; value: string }[]
): HoppRESTParam[] {
  const paramsInOldURL = getParamsInURL(oldURL).map((x) => x.key)

  const checkingParams = currentParams.filter(
    (x) => !paramsInOldURL.includes(x.key)
  )

  const result: HoppRESTParam[] = []

  const addedKeys: string[] = []

  newParams.forEach(({ key, value }) => {
    const currentParam = checkingParams.find(
      ({ key: currentKey }) => currentKey === key
    )

    if (!currentParam) {
      addedKeys.push(key)
      result.push({ key, value, active: true })
    } else {
      addedKeys.push(key)
      result.push({ key, value, active: currentParam.active })
    }
  })

  result.push(...checkingParams.filter((x) => !addedKeys.includes(x.key)))

  return result
}

function removeParamFromURL(url: string, param: string): string {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.delete(param)
    return urlObj.toString()
  } catch (e) {
    return url
  }
}

function removeAllParamsFromURL(url: string): string {
  try {
    const urlObj = new URL(url)
    const params: string[] = []

    urlObj.searchParams.forEach((_value, key) => params.push(key))

    params.forEach((key) => urlObj.searchParams.delete(key))

    return urlObj.toString()
  } catch (e) {
    return url
  }
}

function updateURLParam(
  url: string,
  currKey: string,
  newKey: string,
  newValue: string
): string {
  try {
    const urlObj = new URL(url)

    let params: { key: string; value: string }[] = []

    urlObj.searchParams.forEach((value, key) => params.push({ key, value }))

    params.forEach((x) => urlObj.searchParams.delete(x.key))

    params = params.map((x) => {
      if (x.key === currKey) return { key: newKey, value: newValue }
      else return x
    })

    params.forEach((x) => urlObj.searchParams.append(x.key, x.value))

    return urlObj.toString()
  } catch (e) {
    return url
  }
}

type RESTSession = {
  request: HoppRESTRequest
}

const defaultRESTSession: RESTSession = {
  request: {
    endpoint: "https://httpbin.org/",
    params: [],
    method: "GET",
  },
}

const dispatchers = defineDispatchers({
  setEndpoint(curr: RESTSession, { newEndpoint }: { newEndpoint: string }) {
    const paramsInNewURL = getParamsInURL(newEndpoint)
    const updatedParams = recalculateParams(
      curr.request.endpoint,
      curr.request.params,
      paramsInNewURL
    )

    return {
      request: {
        ...curr.request,
        endpoint: newEndpoint,
        params: updatedParams,
      },
    }
  },
  addParam(curr: RESTSession, { newParam }: { newParam: HoppRESTParam }) {
    return {
      request: {
        ...curr.request,
        params: [...curr.request.params, newParam],
      },
    }
  },
  updateParam(
    curr: RESTSession,
    { index, updatedParam }: { index: number; updatedParam: HoppRESTParam }
  ) {
    const paramsInURL = getParamsInURL(curr.request.endpoint).map((x) => x.key)

    if (paramsInURL.includes(curr.request.params[index].key)) {
      const updatedURL = updateURLParam(
        curr.request.endpoint,
        curr.request.params[index].key,
        updatedParam.key,
        updatedParam.value
      )

      const newParams = curr.request.params.map((param, i) => {
        if (i === index) return updatedParam
        else return param
      })

      return {
        request: {
          ...curr.request,
          endpoint: updatedURL,
          params: newParams,
        },
      }
    } else {
      const newParams = curr.request.params.map((param, i) => {
        if (i === index) return updatedParam
        else return param
      })

      return {
        request: {
          ...curr.request,
          params: newParams,
        },
      }
    }
  },
  deleteParam(curr: RESTSession, { index }: { index: number }) {
    const paramsFromURL = getParamsInURL(curr.request.endpoint).map(
      (x) => x.key
    )
    if (paramsFromURL.includes(curr.request.params[index].key)) {
      const newURL = removeParamFromURL(
        curr.request.endpoint,
        curr.request.params[index].key
      )

      const newParams = getParamsInURL(newURL)

      const recalculatedParams = recalculateParams(
        curr.request.endpoint,
        curr.request.params,
        newParams
      )
      return {
        request: {
          ...curr.request,
          endpoint: newURL,
          params: recalculatedParams,
        },
      }
    } else {
      const newParams = curr.request.params.filter((_x, i) => i !== index)

      return {
        request: {
          ...curr.request,
          params: newParams,
        },
      }
    }
  },
  deleteAllParams(curr: RESTSession) {
    const newURL = removeAllParamsFromURL(curr.request.endpoint)

    return {
      request: {
        ...curr.request,
        endpoint: newURL,
        params: [],
      },
    }
  },
  updateMethod(curr: RESTSession, { newMethod }: { newMethod: string }) {
    return {
      request: {
        ...curr.request,
        method: newMethod,
      },
    }
  },
})

const restSessionStore = new DispatchingStore(defaultRESTSession, dispatchers)

export function setRESTEndpoint(newEndpoint: string) {
  restSessionStore.dispatch({
    dispatcher: "setEndpoint",
    payload: {
      newEndpoint,
    },
  })
}

export function addRESTParam(newParam: HoppRESTParam) {
  restSessionStore.dispatch({
    dispatcher: "addParam",
    payload: {
      newParam,
    },
  })
}

export function updateRESTParam(index: number, updatedParam: HoppRESTParam) {
  restSessionStore.dispatch({
    dispatcher: "updateParam",
    payload: {
      updatedParam,
      index,
    },
  })
}

export function deleteRESTParam(index: number) {
  restSessionStore.dispatch({
    dispatcher: "deleteParam",
    payload: {
      index,
    },
  })
}

export function deleteAllRESTParams() {
  restSessionStore.dispatch({
    dispatcher: "deleteAllParams",
    payload: {},
  })
}

export function updateRESTMethod(newMethod: string) {
  restSessionStore.dispatch({
    dispatcher: "updateMethod",
    payload: {
      newMethod,
    },
  })
}

export const restRequest$ = restSessionStore.subject$.pipe(
  pluck("request"),
  distinctUntilChanged()
)

export const restEndpoint$ = restSessionStore.subject$.pipe(
  pluck("request", "endpoint"),
  distinctUntilChanged()
)

export const restParams$ = restSessionStore.subject$.pipe(
  pluck("request", "params"),
  distinctUntilChanged()
)

export const restMethod$ = restSessionStore.subject$.pipe(
  pluck("request", "method"),
  distinctUntilChanged()
)
