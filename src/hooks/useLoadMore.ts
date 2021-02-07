import { useStore } from 'vuex';
import { ref, computed, ComputedRef } from 'vue';
// 计算属性的interface ComputedRef

interface LoadParams {
  currentPage: number;
  pageSize: number;
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { currentPage: 2, pageSize: 5 }
) => {
  const store = useStore();
  const currentPage = ref(params.currentPage);
  // 注意：requestParams  是一个响应式 对象
  // 注意：箭头函数返回一个对象字面量。要用小括号括起来。
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }));
  //   【加载更多页的逻辑】
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++;
      // 注意加载完最后一页后，currentPage.value 的 值 又加了1
    });
  };
  // 【 是最后一页吗？】
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) + 1 === currentPage.value;
  });
  return { loadMorePage, isLastPage, currentPage };
};

export default useLoadMore;
