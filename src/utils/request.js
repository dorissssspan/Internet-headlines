
/*
*   请求模块(请求封装)
* */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'

const request = axios.create({
  // 接口的基础路径
  baseURL: 'api',
  timeout: 20000 // 20秒超时时间（请求20秒无响应直接判定超时）
})

/*
*   请求拦截器
* */
request.interceptors.request.use(config => {
  // 请求发起会经过这里  config：请求的请求配置对象
  const { user } = store.state
  // user有效并有token数据 添加请求头数据
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 务必要返回 config 配置对象，否则请求就停在这出不去
  return config
}, error => {
  // 如果请求出错（还没出去）会进入这里
  return Promise.reject(error)
})
/*
*  响应拦截器
* */
request.interceptors.response.use(res => {
  // 对响应数据做点什么
  return res
}, error => {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    Toast('身份已过期，请重新登陆')
    router.replace('/login')
  }
  return Promise.reject(error)
})
export default request
