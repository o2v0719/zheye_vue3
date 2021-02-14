<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25" @click="loadMorePage" v-if="!isLastPage">加载更多</button>
    <p class="text-muted text-center" v-if="isLastPage">☺ 。。。没有更多专栏了。。。 ☺</p>
  </div>
</template>

<script lang='ts'>
import ColumnList from '../components/ColumnList.vue';
import { GlobalDataProps } from '../store';
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import useLoadMore from '../hooks/useLoadMore';

export default defineComponent({
  name: 'Home',
  components: { ColumnList },
  setup() {
    const store = useStore<GlobalDataProps>();
    const total = computed(() => store.state.columns.total || 0);
    const currentPage = computed(() => store.state.columns.currentPage || 0);
    onMounted(() => {
      store.dispatch('fetchColumns');
    });
    // 利用计算属性
    const list = computed(() => store.getters.getColumns);
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { currentPage: currentPage.value }, 3);
    // 注意currentPage.value 没有值，说明是第一次点开，即将要第一次点击“加载更多”，此时，当然是要加载第2页。
    return {
      list, loadMorePage, isLastPage
    };
  }
});
</script>
<style>
</style>