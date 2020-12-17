<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{title}}</a>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" :style="{display:'block'}" v-show="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue';
import useClickOutside from '../hooks/useClickOutside';
export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false);
    // 注意setup中不能使用this，和标签中ref同名的属性可以直接拿到dom节点
    const dropdownRef = ref<null | HTMLElement>(null);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };

    const isClickOutside = useClickOutside(dropdownRef);
    // 在下拉列表打开的情况下，点击了下拉列表外的元素 => 关闭下拉列表
    // 用watch函数来监测响应式对象的变化
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false;
      }
    });
    return {
      isOpen,
      toggleOpen, dropdownRef
    };
  }
});
</script>
<style>
</style>