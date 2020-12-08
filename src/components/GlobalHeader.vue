<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">者也专栏</a>
    <!-- 如果没有登陆显示登陆和注册按钮 -->
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">登陆</a></li>
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">注册</a></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <dropdown :title="`你好${user.name}`"></dropdown>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import Dropdown from './DropDown.vue';
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown
  },
  props: {
    user: {
      // 类型限制
      type: Object as PropType<UserProps>,
      // 必填
      required: true
    }
  }
});
</script>
<style>
</style>