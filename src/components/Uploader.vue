<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <!-- vm.$attrs 是一个属性，其包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。这些未识别的属性可以通过 v-bind="$attrs" 传入内部组件 -->
      <slot v-if="fileStatus==='loading'" name="loading">
        <button class="btn btn-primary">正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus==='success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-success">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, PropType } from 'vue';
import axios from 'axios';
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
// 一个自定义检查的函数类型
type CheckFunction = (file: File) => boolean;
export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  // 根元素不要从应用到的父组件上继承class
  inheritAttrs: false,
  emit: ['file-uploaded', 'file-uploaded-error'],
  setup(props, ctx) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>('ready');
    const uploadedData = ref();
    const triggerUpload = () => {
      // 把button的点击事件 转移到 被隐藏的inputDOM上
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement;
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files);
        // 此时 用户选中了本地文件
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0]);
          if (!result) {
            // 如果校验格式不对，不会往下执行
            return;
          }
        }
        fileStatus.value = 'loading';
        const formData = new FormData();
        formData.append('file', files[0]);
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((resp) => {
          // console.log(resp.data);
          fileStatus.value = 'success';
          uploadedData.value = resp.data;
          // 上传成功 返回信息
          ctx.emit('file-uploaded', resp.data);
        }).catch((e) => {
          fileStatus.value = 'error';
          // 上传失败
          ctx.emit('file-uploaded-error', { e });
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
      fileInput, fileStatus, triggerUpload, handleFileChange, uploadedData
    };
  },
});
</script>
<style>
</style>