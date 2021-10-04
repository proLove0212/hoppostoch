import axios from "axios"
import { decodeB64StringToArrayBuffer } from "../utils/b64"
import { settingsStore } from "~/newstore/settings"
import { JsonFormattedError } from "~/helpers/utils/JsonFormattedError"

let cancelSource = axios.CancelToken.source()

export const cancelRunningAxiosRequest = () => {
  cancelSource.cancel()

  // Create a new cancel token
  cancelSource = axios.CancelToken.source()
}

const axiosWithProxy = async (req) => {
  try {
    const { data } = await axios.post(
      settingsStore.value.PROXY_URL || "https://proxy.hoppscotch.io",
      {
        ...req,
        wantsBinary: true,
      },
      {
        cancelToken: cancelSource.token,
      }
    )

    if (!data.success) {
      throw new Error(data.data.message || "Proxy Error")
    }

    if (data.isBinary) {
      data.data = decodeB64StringToArrayBuffer(data.data)
    }

    return data
  } catch (e) {
    // Check if the throw is due to a cancellation
    if (axios.isCancel(e)) {
      // eslint-disable-next-line no-throw-literal
      throw "cancellation"
    } else {
      throw e
    }
  }
}

const axiosWithoutProxy = async (req, _store) => {
  try {
    const res = await axios({
      ...req,
      cancelToken: (cancelSource && cancelSource.token) || "",
      responseType: "arraybuffer",
    })
    return res
  } catch (e) {
    if (axios.isCancel(e)) {
      // eslint-disable-next-line no-throw-literal
      throw "cancellation"
    } else if (e.response?.data) {
      throw new JsonFormattedError(
        JSON.parse(Buffer.from(e.response.data, "base64").toString("utf8"))
      )
    } else {
      throw e
    }
  }
}

const axiosStrategy = (req) => {
  if (settingsStore.value.PROXY_ENABLED) {
    return axiosWithProxy(req)
  }
  return axiosWithoutProxy(req)
}

export const testables = {
  cancelSource,
}

export default axiosStrategy
