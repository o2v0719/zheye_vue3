<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">者也专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <dropdown :title="`你好${user.nickName}`">
        <dropdown-item>
          <router-link to="/create" class="dropdown-item">新建文章</router-link>
        </dropdown-item>
        <dropdown-item>
          <!-- 注意路由跳转的bug：路由相同，组件复用，生命周期钩子函数不触发。 -->
          <router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link>
        </dropdown-item>
        <dropdown-item disabled><a href='#' class="dropdown-item">编辑资料</a></dropdown-item>
        <dropdown-item><a href='#' class="dropdown-item" @click.prevent="logout">退出登陆</a></dropdown-item>
      </dropdown>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import Dropdown from './DropDown.vue';
import DropdownItem from './DropdownItem.vue';
import { GlobalDataProps, UserProps } from '../store';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown, DropdownItem
  },
  props: {
    user: {
      // 类型限制
      type: Object as PropType<UserProps>,
      // 必填
      required: true
    }
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter();
    // const route = useRoute();
    const logout = () => {
      store.dispatch('logout');
      router.push('/');
    };
    // watch(() => route.path, () => {
    //   console.log(route.path);
    //   router.push(route.path);
    // });
    return { logout };
  }
});
</script>
<style>
</style>