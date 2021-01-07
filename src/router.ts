import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import ColumnDetail from './views/ColumnDetail.vue';
import CreatePost from './views/CreatePost.vue';
import Signup from './views/Signup.vue';
import PostDetail from './views/PostDetail.vue';
import store from './store';
import axios from 'axios';
const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      // 如果已登陆，重定向(到首页)
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      // 路由元信息: 这里表示访问create要先验证是否已登陆
      meta: { requiredLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }
  ]
});
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 注意 user.isLogin 并不能在逻辑上和 用户的已登录状态完全匹配。！！！
  const { user, token } = store.state;
  console.log('校验isLogin', user.isLogin);
  const { requiredLogin, redirectAlreadyLogin } = to.meta;
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      store
        .dispatch('fetchCurrentUser')
        .then(() => {
          if (redirectAlreadyLogin) {
            next('/');
          } else {
            console.log('实际已登录，刷新页面走了这里，user.isLogin 是 false');
            next();
          }
        })
        .catch(e => {
          console.log(e);
          store.commit('logout');
          next('/login');
        });
    } else {
      if (requiredLogin) {
        next('/login');
      } else {
        next();
      }
    }
  } else {
    console.log('已登录校验', user.isLogin);
    if (redirectAlreadyLogin) {
      next('/');
    } else {
      next();
    }
  }
});
export default router;
