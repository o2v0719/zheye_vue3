import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import ColumnDetail from './views/ColumnDetail.vue';
import CreatePost from './views/CreatePost.vue';
import Signup from './views/Signup.vue';
import store from './store';
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
    }
  ]
});
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // console.log(to.meta);
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    console.log('已登录的时候验证isLogin', store.state.user.isLogin);
    next({ name: 'login' });
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/');
  } else {
    next();
  }
});
export default router;
