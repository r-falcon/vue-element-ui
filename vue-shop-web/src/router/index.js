import Vue from 'vue'
import Router from 'vue-router'

// 引入Login
// import Login from '../components/Login.vue'
const Login = () => import( /* webpackChunKName:'login_home_welcome' */ '../components/Login.vue')
// 引入Home
// import Home from '../components/Home.vue'
const Home = () => import( /* webpackChunKName:'login_home_welcome' */ '../components/Home.vue')
// 引入Welcome
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import( /* webpackChunKName:'login_home_welcome' */ '../components/Welcome.vue')

// 引入Users
// import Users from '../components/user/Users.vue'
const Users = () => import( /* webpackChunKName:'users_rights_roles' */ '../components/user/Users.vue')
// 引入Rights
// import Rights from '../components/power/Rights.vue'
const Rights = () => import( /* webpackChunKName:'users_rights_roles' */ '../components/power/Rights.vue')
// 引入Roles
// import Roles from '../components/power/Roles.vue'
const Roles = () => import( /* webpackChunKName:'users_rights_role' */ '../components/power/Roles.vue')

// 引入Cate
// import Cate from '../components/goods/Cate.vue'
const Cate = () => import( /* webpackChunKName:'cate_params'*/ '../components/goods/Cate.vue')
// 引入Params
// import Params from '../components/goods/Params.vue'
const Params = () => import( /* webpackChunKName:'cate_params'*/ '../components/goods/Params.vue')

// 引入List
// import List from '../components/goods/List.vue'
const List = () => import( /* webpackChunKName:'list_add'*/ '../components/goods/List.vue')
// 引入Add
// import Add from '../components/goods/Add.vue'
const Add = () => import( /* webpackChunKName:'list_add'*/ '../components/goods/Add.vue')

// 引入Order
// import Order from '../components/order/Order.vue'
const Order = () => import( /* webpackChunKName:'order_report'*/ '../components/order/Order.vue')
// 引入Report
// import Report from '../components/report/Report.vue'
const Report = () => import( /* webpackChunKName:'order_report'*/ '../components/report/Report.vue')

Vue.use(Router)

const router = new Router({
  //添加一个重定向路由规则
  routes: [{
      path: '',
      redirect: '/login'
    },
    // 如果用户后面加上login，则自动重定向到Login所在页面
    {
      path: '/login',
      component: Login
    },
    // 用户单击登录按钮后，系统会自动重定向到Home所指向的页,welcome为home 子路由
    {
      path: '/home',
      component: Home,
      redirect: '/weclome',
      children: [{
          path: '/home',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的页面路径；from 从哪个路径跳转到当前页面；next 放行的函数，有两种方式，第一种直接next(),第二种next()里面放要强制跳转的路径
  // 如果访问的是登录页，直接放行
  if (to.path == '/login') return next()
  //从sessionStorage 中获取保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  //有token，next直接放行
  next()
})

export default router
