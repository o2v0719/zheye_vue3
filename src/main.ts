import { createApp } from 'vue';
import axios from 'axios';
import router from './router';
import store from './store';
import App from './App.vue';

// 5A243FEA06B889FE
axios.defaults.baseURL = 'http://apis.imooc.com/api/';

// 请求拦截
axios.interceptors.request.use(config => {
  // get 请求，添加到url中
  config.params = { ...config.params, icode: '5A243FEA06B889FE' };
  // 其他请求添加到body中
  // 如果是上传文件 ，添加到FormData中。
  if (config.data instanceof FormData) {
    config.data.append('icode', '5A243FEA06B889FE');
  } else {
    config.data = { ...config.data, icode: '5A243FEA06B889FE' };
  }
  store.commit('setLoading', true);
  return config;
});
// 拦截器携带参数简化
// axios.get('/columns?icode=5A243FEA06B889FE');
// axios.get('/columns').then(resp => {
//   console.log(resp.data);
// });

// 响应拦截
axios.interceptors.response.use(config => {
  store.commit('setLoading', false);
  return config;
});
const app = createApp(App);
// vue3 使用use 插件。
app.use(router);
app.use(store);
app.mount('#app');
