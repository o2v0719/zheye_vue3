import { ref, onMounted, onUnmounted, Ref } from 'vue';
// 抽离出来的函数用来判断，点击的事件源（e.target) 是否在指定的html元素（elementRef对象）上
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false);
  const handler = (e: MouseEvent) => {
    // 如果点击的是一个html元素
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false;
      } else {
        isClickOutside.value = true;
      }
    }
  };
  onMounted(() => {
    document.addEventListener('click', handler);
  });
  onUnmounted(() => {
    document.removeEventListener('click', handler);
  });
  return isClickOutside;
};

export default useClickOutside;
