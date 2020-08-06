import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'

// 导入富文本编辑器vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios 请求拦截
axios.interceptors.request.use(config => {
  // 给请求头加上Authorization的字段,值为token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 时间过滤器
Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + 1 + '').padStart(2, '0')

  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app') // for bubble theme
// 注册富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)
