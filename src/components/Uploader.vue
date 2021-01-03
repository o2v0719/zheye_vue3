<template>
  <div class="file-upload">
    <button class="btn btn-primary" @click.prevent="triggerUpload">
      <span v-if="fileStatus==='loading'">正在上传...</span>
      <span v-else-if="fileStatus==='success'">上传成功！</span>
      <span v-else>点击上传</span>
    </button>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import axios from 'axios';
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>('ready');
    const triggerUpload = () => {
      // 把button的点击事件 转移到 被隐藏的inputDOM上
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement;
      if (currentTarget.files) {
        // 此时 用户选中了本地文件
        fileStatus.value = 'loading';
        const files = Array.from(currentTarget.files);

        const formData = new FormData();
        formData.append('file', files[0]);
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          // console.log(resp.data);
          fileStatus.value = 'success';
        }).catch(() => {
          fileStatus.value = 'error';
        }).finally(() => {
          if (fileInput.value) {
            // console.log(fileInput.value.value);
            // 这里对应input DOM元素
            // DOM 的value值是选中文件后的路径。
            fileInput.value.value = '';
          }
        });
      }
    };
    return {
      fileInput, fileStatus, triggerUpload, handleFileChange
    };
  },
});
</script>
<style>
</style>