<template>
  <div class="create-post-page">
    <h4>{{isEditMode?'编辑文章':'新建文章'}}</h4>
    <uploader action='/upload' :beforeUpload="uploadCheck" @file-uploaded="handleFileUploaded" :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4">
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <!-- bootstrap 定义的一个旋转的小圈圈 -->
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="slotProps">
        <img :src="slotProps.uploadedData.data.url" alt="">
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题:</label>
        <validate-input :rules="titleRules" v-model="titleVal" placeholde="请输入文章标题" type="text">
        </validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情:</label>
        <validate-input rows="10" type="text" tag="textarea" placeholder="请输入文章详情" :rules="contentRules" v-model="contentVal">
        </validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode?'更新文章':'发表文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store';
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue';
import ValidateForm from '../components/ValidateForm.vue';
import Uploader from '../components/Uploader.vue';
import axios from 'axios';
import { beforeUploadCheck } from '../helper';
import createMessage from '../components/createMessage';
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput, ValidateForm, Uploader
  },
  setup() {
    const titleVal = ref('');
    const router = useRouter();
    // route 可以拿到url
    const route = useRoute();
    // 注意 ： 将字符串转换成boolean类型的方式。
    const isEditMode = !!route.query.id;
    const store = useStore<GlobalDataProps>();
    let imageId = '';
    const uploadedData = ref();
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ];

    const contentVal = ref('');
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ];
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          // 数据填充 => 改造uploader 组件
          const currentPost = rawData.data;
          if (currentPost && currentPost.image) {
            // 填充图片
            uploadedData.value = { data: currentPost.image };
          }
          if (currentPost) {
            // 填充标题，文章
            titleVal.value = currentPost.title;
            contentVal.value = currentPost.content || '';
          }
        });
      }
    });
    // 拿到返回的图片imageId
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data && rawData.data._id) {
        imageId = rawData.data._id;
      }
    };
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user;
        // 类型守护
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          };
          if (imageId) {
            newPost.image = imageId;
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost';
          const sendData = isEditMode ? {
            // 是【编辑模式】，要明确文章的id，作为params发起axios
            id: route.query.id,
            payload: newPost
          } : newPost;

          store.dispatch(actionName, sendData).then(() => {
            createMessage(isEditMode ? '更新成功，2秒后跳转到文章' : '发表成功，2秒后跳转到文章', 'success', 2000);
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } });
            }, 2000);
          });
        }
      }
    };

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
        const formData = new FormData();
        formData.append(uploadedFile.name, uploadedFile);
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'mutipart/form-data'
          }
        }).then((resp: any) => {
          console.log(resp);
        });
      }
    };
    // 上传前检查文件类型
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      });
      const { passed, error } = result;
      if (error === 'format') {
        createMessage('上传图片只能是JGP/PNG格式', 'error');
      }
      if (error === 'size') {
        createMessage('上传图片不能超过1Mb', 'error');
      }
      return passed;
    };

    return {
      titleRules, titleVal, contentVal, contentRules, onFormSubmit, handleFileChange, uploadCheck, handleFileUploaded, uploadedData, isEditMode
    };
  }
});
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 200px;
  /* 注意object-fit ，支持响应性*/
  /* cover 表示高度和宽度其中一个和容器一致 */
  object-fit: cover;
}
.slotCon {
}
</style>