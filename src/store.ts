import { createStore } from 'vuex';

import { testData, testPosts, ColumnProps, PostProps } from './testData';
export { ColumnProps, PostProps } from './testData';
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: true, name: 'viking', columnId: 1 }
  },
  mutations: {
    login(state) {
      state.user = {
        ...state.user,
        //  向前覆盖！！！
        // es6 标准入门: 如果用户自定义的属性放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖。
        isLogin: true,
        name: 'viking'
      };
    },
    createPost(state, newPost) {
      state.posts.push(newPost);
    }
  },
  getters: {
    biggerColumnsLen(state) {
      return state.columns.filter(c => c.id > 2).length;
    },
    // getColumnById: state => (id: number) => {
    //   return state.columns.find(c => c.id === id);
    // },
    //  同下写法
    getColumnById(state) {
      return (id: number) => {
        return state.columns.find(c => c.id === id);
      };
    },
    getPostsByCid: state => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid);
    }
  }
});

export default store;
