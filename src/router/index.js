import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import shopList from '../components/shopList'
import buyList from '../components/buyList'
import stockList from '../components/stockList'
import member from '../components/member'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
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
    }
  ]
})
