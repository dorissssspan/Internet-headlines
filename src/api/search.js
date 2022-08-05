
/*
*  搜索请求模块
* */

import request from '@/utils/request'

// 获取联想建议
export const getSearchsuggestion = (q) => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: { q }
  })
}
// 获取搜索结果
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
