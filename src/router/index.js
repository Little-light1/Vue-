import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User/User.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Categories from '../components/Goods/Categories.vue'
import Params from '../components/Goods/Params.vue'
import List from '../components/Goods/List.vue'
import AddGoods from '../components/Goods/AddGoods.vue'
import Order from '../components/Order/Order.vue'
import Report from '../components/Report/Report.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    // 子路由
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
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
        component: Categories
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
        component: AddGoods
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

const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转过来
  // next 是一个函数，表示放行
  // next()放行  next('/路径')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果不存在token的值则跳转到登录页
  if (!tokenStr) return next('/login')
  // 存在就直接放行
  next()
})
export default router
