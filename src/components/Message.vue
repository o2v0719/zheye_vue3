<template>
  <teleport to="#message">
    <div class="alert message-info fade show fixed-top w-50 mx-auto d-flex justify-content-between mt-2" :class="classObj" v-if="isVisible">
      <span>{{message}}!</span>
      <button type="button" class="btn-close" @click.prevent="hide" aria-label="Close"></button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import useDOMCreate from '../hooks/useDomCreate';
export type MessageType = 'success' | 'error' | 'default';
export default defineComponent({
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  // 自定义事件
  emits: ['close-message'],
  setup(props, ctx) {
    useDOMCreate('message');
    const isVisible = ref(true);
    const classObj = {
      // vue 的动态绑定class 决定的class对象格式
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    };
    const hide = () => {
      isVisible.value = false;
      ctx.emit('close-message', true);
    };
    return {
      isVisible, classObj, hide
    };
  }
});
</script>