/* 
  main.js为整个项目的入口文件
 */

// 导入Vue
import Vue from 'vue'
// 导入app跟组件
import App from './App.vue'
// 导入路由
import router from './router'
// 导入element ui对应的组件
import './plugins/element.js'
// 导入自己创建的全局样式表
import './assets/css/global.css'
// 引入element-ui及相应的样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入树形结构
import TreeTable from 'vue-table-with-tree-grid'
// 注册为全局通用组件
Vue.component('tree-table', TreeTable)
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//引入ant-design-vue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

// 将富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor)

Vue.use(Antd);

// 导入 NProgress 包对应的js和css
import NProgress from 'nprogress'

// 导入axios
import axios from 'axios'
// 将其挂载到vue的原型对象上
Vue.prototype.$http = axios
// 为axios设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置一个拦截器
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为config做一下预处理
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 创建一个实例
new Vue({
  // 将路由挂在了vue实例上
  router,
  // 将app和组件渲染到页面上
  render: h => h(App)
}).$mount('#app')
