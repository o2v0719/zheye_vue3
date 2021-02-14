<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePage" v-if="!isLastPage">加载更多</button>
    <p class="text-muted text-center" v-if="isLastPage">☺ 已加载到最后 ☺</p>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps, ColumnProps } from '../store';
import PostList from '../components/PostList.vue';
import { addColumnAvatar } from '../helper';
import useLoadMore from '../hooks/useLoadMore';

export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataProps>();
    // 从当前路由获取currentId
    const currentId = route.params.id;
    onMounted(() => {
      store.dispatch('fetchColumn', currentId);
      store.dispatch('fetchPosts', { cid: currentId });
    });
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined;
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100);
      }
      return selectColumn;
    });
    const list = computed(() => store.getters.getPostsByCid(currentId));
    // 已明确cid的column，post的总数
    const count = computed(() => store.getters.getPostsCountByCid(currentId));
    // 确定cid的column 当前加载到的页数
    const currentPage = computed(() => store.getters.getPostsCurrentPageByCid(currentId));
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', count, { currentPage: currentPage.value, cid: currentId });
    return {
      list, column, loadMorePage, isLastPage
    };
  },
});
</script>
<style>
</style>