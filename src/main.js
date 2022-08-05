import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vant 核心组件库
import Vant from 'vant'
// Vant 全局样式
import 'vant/lib/index.css'
// 全局样式
import './style/index.less'
// 动态设置 REM 基准值
import 'amfe-flexible'
// 加载dayjs初始化配置
import './utils/dayjs'
// 代码高亮样式
import 'highlight.js/styles/default.css'

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
