import Vue from 'vue'
import VueRouter from 'vue-router'
import { getItem } from '@/utils/storage'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/',
    redirect: '/home' // 默认打开首页（layout页下的home）
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    beforeEnter: (to, from, next) => {
      // 有token，不能去登录页，无token，需要用户“权限”才需要去登录页
      if (getItem()?.length > 0) {
        next('/home')
      } else {
        next() // 其他情况放行
      }
    }
  },
  {
    path: '/layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启props传参
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫（在路由发生真正跳转之前，执行此函数）
// router.beforeEach((to, from, next) => {
//   // 有token，不能去登录页，无token，需要用户“权限”才需要去登录页
//   if (getItem()?.length > 0 && to.path === '/login') {
//     next(false)
//   } else {
//     next() // 其他情况放行
//   }
// })

export default router
