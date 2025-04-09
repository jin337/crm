import { Message } from '@arco-design/web-react'
import axios from 'axios'

import { localGetItem } from 'src/utils/common'

const Http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器
Http.interceptors.request.use(
  (config) => {
    const Authorization = localGetItem('AUTHTOKEN')
    if (Authorization) {
      config.headers.token = Authorization.token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
Http.interceptors.response.use(
  (response) => {
    const { data } = response
    if ([200, '000000'].includes(data.code)) {
      // 成功
      return Promise.resolve(data)
    } else {
      Message.error(data.message || data.error)
      return Promise.resolve(data)
    }
  },
  (error) => {
    const { response } = error
    if ([401].includes(response?.data?.code)) {
      // 无效code,跳转至域名
      sessionStorage.clear()
      Message.error(response?.data.message)
      setTimeout(() => {
        window.location.href = window.location.protocol + '//' + window.location.host + '/login'
      }, 1000)
    } else Promise.reject(error)
  }
)

export default Http
