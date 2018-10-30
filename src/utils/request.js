import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    // 校验Http状态码
    const status = response.status
    if (status === 200) {
      /**
       * 部分接口返回code和message，需要自行判断结果
       */
      return response.data
    } else if (status === 401) {
      Message({
        message: '401您没有权限',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: status + response.statusText,
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用方法
export const POST = (url, params) => {
  return service.post(url, params).then(res => res)
}

export const GET = (url, params) => {
  return service.get(url, {
    params: params
  }).then(res => res)
}

export const PUT = (url, params) => {
  return service.put(url, params).then(res => res)
}

export const DELETE = (url, params) => {
  return service.delete(url, {
    params: params
  }).then(res => res)
}

export const PATCH = (url, params) => {
  return service.patch(url, params).then(res => res)
}

export default service
