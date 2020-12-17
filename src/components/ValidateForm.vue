<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <!-- 插槽里面默认有一个按钮，当父级需要个性化定制内容时，默认的按钮会被替换 -->
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang='ts'>
import { defineComponent, onUnmounted } from 'vue';
// 非父子关系通信
import mitt from 'mitt';

// 创建一个监听器实例
export const emitter = mitt();
type ValidateFunc = () => boolean;
export default defineComponent({
  // emits 的作用：
  // 1.明确这个组件的事件都有什么，不写也没关系
  // 2.可以享受类型推论，当你 context.emit 的时候，第一个参数会字段推断成你定义的 emits 数组中的值，可以自动补全。
  // 3.当你 context.emit 的时候，第一个参数会字段推断成你定义的 emits 数组中的值，可以自动补全。
  emits: ['form-submit'],
  setup(props, ctx) {
    let funcArr: ValidateFunc[] = [];
    const submitForm = () => {
      // 使用every方法遍历验证，把结果发出去
      const result = funcArr.map(func => func()).every(result => result);
      ctx.emit('form-submit', result);
    };
    // 注意！！
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func);
      }
    };
    emitter.on('form-item-created', callback);
    onUnmounted(() => {
      emitter.off('form-item-created', callback);
      funcArr = [];
    });
    return {
      submitForm
    };
  },

});
</script>
<style scoped>
.validate-form-container {
  margin-bottom: 15px;
}
</style>