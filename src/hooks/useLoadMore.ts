import { useStore } from 'vuex';
import { ref, computed, ComputedRef } from 'vue';
// 计算属性的interface ComputedRef

interface LoadParams {
  currentPage?: number;
  pageSize?: number;
  [key: string]: any;
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = {},
  pageSize = 3
) => {
  const store = useStore();
  const currentPage = ref((params && params.currentPage) || 1);
  // 注意：requestParams  是一个响应式 对象
  // 注意：箭头函数返回一个对象字面量。要用小括号括起来。
  const requestParams = computed(() => ({
    ...params,
    currentPage: currentPage.value + 1
  }));
  //   【加载更多页的逻辑】
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++;
      // 注意加载完最后一页后，currentPage.value 的 值 又加了1;
    });
  };
  // 【 是最后一页吗？】
  const isLastPage = computed(() => {
    return Math.ceil(total.value / pageSize) === currentPage.value;
  });

  return { loadMorePage, isLastPage, currentPage };
};

export default useLoadMore;
