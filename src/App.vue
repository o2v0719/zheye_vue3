<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>

    <loader text="拼命加载中" background="rgba(0,0,0,.8)" v-if="isLoading">正在读取😀</loader>

    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalHeader from './components/GlobalHeader.vue';
import Loader from './components/Loader.vue';
import { GlobalDataProps } from './store';
import createMessage from './components/createMessage';
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader, Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const currentUser = computed(() => store.state.user);
    const isLoading = computed(() => store.state.loading);
    // const token = computed(() => store.state.token);
    const error = computed(() => store.state.error);
    /*     onMounted(() => {
          // 如果没有登陆，且token存在
          if (!currentUser.value.isLogin && token.value) {
            axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
            store.dispatch('fetchCurrentUser');
          }
        }); */
    // watch 一个响应式对象的属性。使用getters改写
    watch(() => error.value.status, () => {
      const { status, message } = error.value;
      if (status && message) {
        createMessage(message, 'error');
      }
    });
    return {
      currentUser, isLoading, error
    };
  }
});
</script>

<style>
</style>
