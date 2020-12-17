<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <!-- form-submit 子传父 -->
    <validate-form @form-submit="onFormSubmit">
      <!-- 邮箱 -->
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" ref="inputRef"></validate-input>
        <p>在父组件中展示{{emailVal}}</p>
      </div>
      <!-- 密码 -->
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <validate-input type="password" class="form-control" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
      </div>
      <template v-slot:submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import ColumnList, { ColumnProps } from './components/ColumnList.vue';
import ValidateInput, { RulesProp } from './components/ValidateInput.vue';
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue';
import ValidateForm from './components/ValidateForm.vue';
const currentUser: UserProps = {
  isLogin: true,
  name: 'viking'
};
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧',
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 3,
    title: 'test3的专栏',
    description: '这是的test3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 4,
    title: 'test4的专栏',
    description: '这是的test4专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  }
];
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader, ValidateInput, ValidateForm
  },
  setup() {
    const inputRef = ref<any>();
    const emailVal = ref('');
    const passwordVal = ref('');
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮件地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' },
      { type: 'range', message: '输入字符数超出限制' }
    ];
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '请输入正确的密码格式' },
      { type: 'range', message: '输入字符数超出限制' }
    ];
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    });
    const validateEmail = () => {
      if (emailRef.val.trim() === '') {
        emailRef.error = true;
        emailRef.message = "can not be empty";
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true;
        emailRef.message = "should be valid address";
      }
    };
    const onFormSubmit = (result: boolean) => {
      console.log('result', result);
    };
    return {
      list: testData, inputRef,
      currentUser, emailRef, validateEmail, emailRules, emailVal, passwordVal, passwordRules, onFormSubmit
    };
  }
});
</script>

<style>
</style>
