// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import '../theme/index.css'
import http from 'axios'
import huDirective from 'imgbig'
http.defaults.headers.common['Authorization'] = '';
http.interceptors.request.use(
  config=>{
    const token =sessionStorage.getItem('token');
    token && (config.headers.Authorization=token);
    return config;
  },
  error => {
    return Promise.error(error);
  }
)
http.interceptors.response.use(
  response=>{
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.push('/login')
          break;
        case 403:
          router.push('/login')
          // 清除token
          break;
        // 其他错误，直接抛出错误提示
        case 504:
          router.push('/login');
          break;
        default:
          router.push('/login');
          break;
      }
      return Promise.reject(error.response);
    }
  }
)
Vue.config.productionTip = false
Vue.prototype.$http=http;
Vue.use(ElementUI);
Vue.use(huDirective);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
