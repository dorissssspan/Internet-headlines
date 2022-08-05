import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包 (默认英文）
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 全局使用
dayjs.locale('zh-cn')

// console.log(dayjs().format('YYYY-MMM-DD'))
// console.log(dayjs().from(dayjs('1990')))

// 定义一个全局过滤器,可以在任何组件模板中使用
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
