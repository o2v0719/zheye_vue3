<template>
  <div class="post-detail-page">
    <article class="w-75 mx-auto mb-5 pb-3">
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author==='object'"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于:{{currentPost.createdAt}}</span>
      </div>
      <div v-html="currentHTML"></div>
    </article>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataProps, PostProps, ImageProps } from '../store';
import UserProfile from '../components/UserProfile.vue';
export default defineComponent({
  name: 'post-detail',
  components: {
    UserProfile
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    // 拿到访问文章的id
    const currentId = route.params.id;
    const md = new MarkdownIt();
    // 请求数据，在mouted周期节点
    onMounted(() => {
      store.dispatch('fetchPost', currentId);
    });
    const currentPost = computed<PostProps>(() =>
      store.getters.getCurrentPost(currentId)
    );
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        const { isHTML, content } = currentPost.value;
        // 如果是html，直接渲染
        // 如果数据是markdown格式的用markdown渲染。
        return isHTML ? content : md.render(currentPost.value.content);
      }
    });
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value;
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850';
      } else {
        return null;
      }
    });
    return {
      currentHTML, currentImageUrl, currentPost
    };
  },
});
</script>
<style>
</style>