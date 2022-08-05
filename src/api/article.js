
/*
* 文章请求模块
* */

import request from '@/utils/request'

// 请求获取文章列表数据
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}
// 获取文章
export const getArticleById = articleid => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleid}`
  })
}
// 收藏文章
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: { target }
  })
}
// 取消收藏文章
export const delCollect = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}
// 点赞文章
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: { target }
  })
}
// 取消点赞文章
export const delLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
