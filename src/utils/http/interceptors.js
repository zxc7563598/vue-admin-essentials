/**********************************
 * @FilePath: interceptors.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:46:40
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { useAuthStore } from '@/store'
import { lStorage } from '@/utils'
import { encryptRequest } from 'hejunjie-encrypted-request'
import { resolveResError } from './helpers'

let cachedPublicKey = null
export async function loadPublicKey() {
  if (cachedPublicKey)
    return cachedPublicKey
  const res = await fetch('/keys/public_key.pem')
  if (!res.ok)
    throw new Error('Failed to load public key')
  const key = await res.text()
  cachedPublicKey = key
  return key
}

export function setupInterceptors(axiosInstance) {
  const SUCCESS_CODES = [0, 200]
  function resResolve(response) {
    const { data, status, config, statusText, headers } = response
    if (headers['content-type']?.includes('json')) {
      if (SUCCESS_CODES.includes(data?.code)) {
        return Promise.resolve(data)
      }
      const code = data?.code ?? status

      const needTip = config?.needTip !== false

      // 根据code处理对应的操作，并返回处理后的message
      const message = resolveResError(code, data?.message ?? statusText, needTip)

      return Promise.reject({ code, message, error: data ?? response })
    }
    return Promise.resolve(data ?? response)
  }

  axiosInstance.interceptors.request.use(reqResolve, reqReject)
  axiosInstance.interceptors.response.use(resResolve, resReject)
}

async function reqResolve(config) {
  // 处理不需要token的请求
  if (config.needToken !== false) {
    const { accessToken } = useAuthStore()
    if (accessToken) {
      config.headers['X-Auth-Token'] = accessToken
    }
  }
  // 添加 Accept-Language 头参数
  config.headers['Accept-Language'] = lStorage.get('locale') || 'zh'
  // 加密请求参数
  if (config.data === undefined) {
    config.data = {}
  }
  const options = {
    rsaPubKey: await loadPublicKey(),
  }
  config.data = encryptRequest(removeEmptyValues(config.data), options)
  return config
}

function reqReject(error) {
  return Promise.reject(error)
}

async function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)
    return Promise.reject({ code, message, error })
  }

  const { data, status, config } = error.response
  const code = data?.code ?? status

  const needTip = config?.needTip !== false
  const message = resolveResError(code, data?.message ?? error.message, needTip)

  return Promise.reject({ code, message, error: error.response?.data || error.response })
}

// 参数过滤
function removeEmptyValues(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    switch (obj[key]) {
      case null:
      case undefined:
      case '':
        break
      default:
        if ((typeof obj[key]) == 'object' && !Object.keys(obj[key]).length) {
          return acc
        }
        acc[key] = obj[key]
        break
    }
    return acc
  }, {})
}
