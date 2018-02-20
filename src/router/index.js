import Vue from 'vue'
import Router from 'vue-router'

const Login = resolve => require(['../pages/Login.vue'], resolve)
const ForgetPassword = resolve => require(['../pages/ForgetPassword.vue'], resolve)
const Home = resolve => require(['../pages/Home.vue'], resolve)
const NeedsFormManagement = resolve => require(['../pages/menu/NeedsFormManagement.vue'], resolve)
const NeedsFormManagementSales = resolve => require(['../pages/menu/NeedsFormManagementSales.vue'], resolve)
const ProjectManagement = resolve => require(['../pages/menu/ProjectManagement.vue'], resolve)
const SupplierManagement = resolve => require(['../pages/menu/SupplierManagement.vue'], resolve)
const AccountManagement = resolve => require(['../pages/menu/AccountManagement.vue'], resolve)
const InfoManagement = resolve => require(['../pages/menu/InfoManagement.vue'], resolve)
const Information = resolve => require(['../pages/Information.vue'], resolve)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/login',
      children: [
        {
          path: '/needsformmanagement',
          name: '需求单管理',
          component: NeedsFormManagement,
          role: '1,2'
        },
        {
          path: '/needsformmanagementsales',
          name: '需求单管理 ',
          component: NeedsFormManagementSales,
          role: '3'
        },
        {
          path: '/projectmanagement',
          name: '项目管理',
          component: ProjectManagement,
          role: '1,2,3'
        },
        {
          path: '/suppliermanagement',
          name: '供应商管理',
          component: SupplierManagement,
          role: '1,2'
        },
        {
          path: '/accountmanagement',
          name: '账号管理',
          component: AccountManagement,
          role: '1,2'
        },
        {
          path: '/infomanagement',
          name: '信息管理',
          component: InfoManagement,
          role: '1,2'
        }
      ]
    },
    {
      path: '/information',
      name: 'Information',
      component: Information
    }
  ]
})

export default router
