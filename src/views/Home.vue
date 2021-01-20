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
  </div>
</template>

<script lang='ts'>
import ColumnList from '../components/ColumnList.vue';
import { GlobalDataProps, ResponseType, ImageProps } from '../store';
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import createMessage from '../components/createMessage';

export default defineComponent({
  name: 'Home',
  components: { ColumnList },
  setup() {
    const store = useStore<GlobalDataProps>();
    onMounted(() => {
      store.dispatch('fetchColumns');
    });
    // 利用计算属性
    const list = computed(() => store.getters.getColumns);
    // 规定一个上传图片前的校验格式函数
    const beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        createMessage('上传图片只能是JPG格式', 'error');
      };
      return isJPG;
    };
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data) {
        createMessage(`已上传图片,ID ${rawData.data._id}`, 'success');
      }
    };
    const onFileUploadedError = (rawData: ResponseType) => {
      createMessage(`上传图片失败, ${rawData.error}`, 'error');
    };
    return {
      list, beforeUpload, onFileUploaded, onFileUploadedError
    };
  }
});
</script>
<style>
</style>