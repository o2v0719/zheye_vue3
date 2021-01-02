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
  // 重置error
  store.commit('setError', { status: false, message: '' });
  return config;
});
// 拦截器携带参数简化
// axios.get('/columns?icode=5A243FEA06B889FE');
// axios.get('/columns').then(resp => {
//   console.log(resp.data);
// });

// 响应拦截
axios.interceptors.response.use(
  // 响应成功的处理逻辑
  config => {
    store.commit('setLoading', false);
    return config;
  },
  // 响应失败的处理逻辑
  e => {
    const { error } = e.response.data;
    // 在mutation 中处理的逻辑
    store.commit('setError', { status: true, message: error });
    store.commit('setLoading', false);
    return Promise.reject(error);
  }
);
const app = createApp(App);
// vue3 使用use 插件。
app.use(router);
app.use(store);
app.mount('#app');
