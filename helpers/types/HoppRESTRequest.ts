import { ValidContentTypes } from "../utils/contenttypes"
import { HoppRESTAuth } from "./HoppRESTAuth"

export const RESTReqSchemaVersion = "1"

export type HoppRESTParam = {
  key: string
  value: string
  active: boolean
}

export type HoppRESTHeader = {
  key: string
  value: string
  active: boolean
}

export type FormDataKeyValue = {
  key: string
  active: boolean
} & ({ isFile: true; value: Blob[] } | { isFile: false; value: string })

export type HoppRESTReqBodyFormData = {
  contentType: "multipart/form-data"
  body: FormDataKeyValue[]
}

export type HoppRESTReqBody =
  | {
      contentType: Exclude<ValidContentTypes, "multipart/form-data">
      body: string
    }
  | HoppRESTReqBodyFormData

export interface HoppRESTRequest {
  v: string

  name: string
  method: string
  endpoint: string
  params: HoppRESTParam[]
  headers: HoppRESTHeader[]
  preRequestScript: string
  testScript: string

  auth: HoppRESTAuth

  body: HoppRESTReqBody
}

export function makeRESTRequest(
  x: Omit<HoppRESTRequest, "v">
): HoppRESTRequest {
  return {
    ...x,
    v: RESTReqSchemaVersion,
  }
}

export function isHoppRESTRequest(x: any): x is HoppRESTRequest {
  return x && typeof x === "object" && "v" in x
}

function parseRequestBody(x: any): HoppRESTReqBody {
  if (x.contentType === "application/json") {
    return {
      contentType: "application/json",
      body: x.rawParams,
    }
  }

  return {
    contentType: "application/json",
    body: "",
  }
}

export function translateToNewRequest(x: any): HoppRESTRequest {
  if (isHoppRESTRequest(x)) {
    return x
  } else {
    // Old format
    const endpoint: string = `${x.url}${x.path}`

    const headers: HoppRESTHeader[] = x.headers

    // Remove old keys from params
    const params: HoppRESTParam[] = (x.params as any[]).map(
      ({ key, value, active }) => ({
        key,
        value,
        active,
      })
    )

    const name = x.name
    const method = x.method

    const preRequestScript = x.preRequestScript
    const testScript = x.testScript

    const body = parseRequestBody(x)

    const auth = parseOldAuth(x)

    const result: HoppRESTRequest = {
      name,
      endpoint,
      headers,
      params,
      method,
      preRequestScript,
      testScript,
      body,
      auth,
      v: RESTReqSchemaVersion,
    }

    return result
  }
}

export function parseOldAuth(x: any): HoppRESTAuth {
  if (!x.auth || x.auth === "None")
    return {
      authType: "none",
      authName: "None",
      authActive: true,
    }

  if (x.auth === "Basic Auth")
    return {
      authType: "basic",
      authName: "Basic Auth",
      authActive: true,
      username: x.httpUser,
      password: x.httpPassword,
    }

  if (x.auth === "Bearer Token")
    return {
      authType: "bearer",
      authName: "Bearer Token",
      authActive: true,
      token: x.bearerToken,
    }

  return { authType: "none", authName: "None", authActive: true }
}
