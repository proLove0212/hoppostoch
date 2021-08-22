import clone from "lodash/clone"
import { FormDataKeyValue, HoppRESTRequest } from "./types/HoppRESTRequest"
import { isJSONContentType } from "./utils/contenttypes"
import { defaultRESTRequest } from "~/newstore/RESTSession"

/**
 * Handles translations for all the hopp.io REST Shareable URL params
 */
export function translateExtURLParams(
  urlParams: Record<string, any>
): HoppRESTRequest {
  if (urlParams.v) return parseV1ExtURL(urlParams)
  else return parseV0ExtURL(urlParams)
}

function parseV0ExtURL(urlParams: Record<string, any>): HoppRESTRequest {
  const resolvedReq = clone(defaultRESTRequest)

  if (urlParams.method && typeof urlParams.method === "string") {
    resolvedReq.method = urlParams.method
  }

  if (urlParams.url && typeof urlParams.url === "string") {
    if (urlParams.path && typeof urlParams.path === "string") {
      resolvedReq.endpoint = `${urlParams.url}/${urlParams.path}`
    } else {
      resolvedReq.endpoint = urlParams.url
    }
  }

  if (urlParams.headers && typeof urlParams.headers === "string") {
    resolvedReq.headers = JSON.parse(urlParams.headers)
  }

  if (urlParams.params && typeof urlParams.params === "string") {
    resolvedReq.params = JSON.parse(urlParams.params)
  }

  if (urlParams.httpUser && typeof urlParams.httpUser === "string") {
    resolvedReq.auth = {
      authType: "basic",
      authActive: true,
      username: urlParams.httpUser,
      password: urlParams.httpPassword ?? "",
    }
  }

  if (urlParams.bearerToken && typeof urlParams.bearerToken === "string") {
    resolvedReq.auth = {
      authType: "bearer",
      authActive: true,
      token: urlParams.bearerToken,
    }
  }

  if (urlParams.contentType) {
    if (urlParams.contentType === "multipart/formdata") {
      resolvedReq.body = {
        contentType: "multipart/form-data",
        body: JSON.parse(urlParams.bodyParams || "[]").map(
          (x: any) =>
            <FormDataKeyValue>{
              active: x.active,
              key: x.key,
              value: x.value,
              isFile: false,
            }
        ),
      }
    } else if (isJSONContentType(urlParams.contentType)) {
      if (urlParams.rawInput) {
        resolvedReq.body = {
          contentType: urlParams.contentType,
          body: urlParams.rawInput,
        }
      } else {
        resolvedReq.body = {
          contentType: urlParams.contentType,
          body: urlParams.bodyParams,
        }
      }
    } else {
      resolvedReq.body = {
        contentType: urlParams.contentType,
        body: urlParams.rawInput,
      }
    }
  }

  return resolvedReq
}

function parseV1ExtURL(urlParams: Record<string, any>): HoppRESTRequest {
  const resolvedReq = clone(defaultRESTRequest)

  if (urlParams.headers && typeof urlParams.headers === "string") {
    resolvedReq.headers = JSON.parse(urlParams.headers)
  }

  if (urlParams.params && typeof urlParams.params === "string") {
    resolvedReq.params = JSON.parse(urlParams.params)
  }

  if (urlParams.method && typeof urlParams.method === "string") {
    resolvedReq.method = urlParams.method
  }

  if (urlParams.endpoint && typeof urlParams.endpoint === "string") {
    resolvedReq.endpoint = urlParams.endpoint
  }

  return resolvedReq
}
