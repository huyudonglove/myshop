import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import shopList from '../components/shopList'
import buyList from '../components/buyList'
import stockList from '../components/stockList'
import member from '../components/member'
import role from '../components/role'
import login from '../components/login'
import logout from '../components/logout'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      children:[
        {
          path:'/shopList',
          name:'shopList',
          component:shopList
        },
        {
          path:'/buyList',
          name:'buyList',
          component:buyList
        },
        {
          path:'/stockList',
          name:'stockList',
          component:stockList
        },
        {
          path:'/member',
          name:'member',
          component:member
        },
        {
          path:'/role',
          name:'role',
          component:role
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/logout',
      name:'logout',
      component:logout
    }
  ]
})
