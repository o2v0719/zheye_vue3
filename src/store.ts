import { createStore, Commit } from 'vuex';
import axios, { AxiosRequestConfig } from 'axios';
import { arrToObj, objToArr } from './helper';
export interface ResponseType<P = {}> {
  code: number;
  msg?: string;
  data?: P;
  error?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
// 专栏属性
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
// 文章属性
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps {
  // true 表示错误存在
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  loading: boolean;
  columns: ListProps<ColumnProps>;
  posts: ListProps<PostProps>;
  user: UserProps;
  token: string;
}
// 封装一个axios请求
const getAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit
) => {
  // 加载进度条状态管理
  const { data } = await axios.get(url);
  commit(mutationName, data);
  return data;
};
const postAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  payload: any
) => {
  // 加载进度条状态管理
  const { data } = await axios.post(url, payload);
  commit(mutationName, data);
  return data;
};
// 把post 和 patch 整合到一起
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }
) => {
  const { data } = await axios(url, config);
  commit(mutationName, data);
  // console.log(data);
  return data;
};
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: {},
    posts: {},
    user: { isLogin: false }
  },
  mutations: {
    /*  login(state) {
      state.user = {
        ...state.user,
        //  向前覆盖！！！
        // es6 标准入门: 如果用户自定义的属性放在扩展运算符后面(前后都可以），则扩展运算符内部的同名属性会被覆盖。
        isLogin: true,
        name: 'viking'
      };
    }, */
    createPost(state, newPost) {
      state.posts[newPost._id] = newPost;
    },
    fetchColumns(state, rawData) {
      state.columns = arrToObj(rawData.data.list);
    },
    fetchColumn(state, rawData) {
      state.columns[rawData.data._id] = rawData.data;
    },
    fetchPosts(state, rawData) {
      state.posts = arrToObj(rawData.data.list);
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e;
    },
    login(state, rawData) {
      const { token } = rawData.data;
      state.token = token;
      // https://github.com/axios/axios
      // 登陆成功后，把token保存到localStorage中
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data };
    },
    logout(state) {
      // 退出登陆：三件事
      state.token = '';
      state.user = { isLogin: false };
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
    },
    fetchPost(state, rawData) {
      state.posts[rawData.data._id] = rawData.data;
    },
    updatePost(state, { data }) {
      state.posts[data._id] = data;
    },
    deletePost(state, { data }) {
      delete state.posts[data._id];
    }
  },
  actions: {
    // 使用 es7 async 和await 简化异步写法
    /*  async fetchColumns(ctx) {
      const { data } = await axios.get('./columns');
      ctx.commit('fetchColumns', data);
    }, */
    // 使用封装过的函数发起axios请求
    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit);
    },
    // 使用参数解构来简化代码
    /* fetchColumn({ commit }, cid) {
      axios.get(`/columns/${cid}`).then(resp => {
        commit('fetchColumn', resp.data);
      });
    }, */
    /* async fetchColumn({ commit }, cid) {
      const { data } = await axios.get(`/columns/${cid}`);
      commit('fetchColumn', data);
    },
    async fetchPosts({ commit }, cid) {
      const { data } = await axios.get(`/columns/${cid}/posts`);
      commit('fetchPosts', data);
    } */
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit);
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload);
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit);
    },
    // 组合action 处理复杂异步
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser');
      });
    },
    // 发布文章
    createPost({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, {
        method: 'post',
        data: payload
      });
    },
    // 请求指定id的文章
    fetchPost({ commit }, pid) {
      return asyncAndCommit(`/posts/${pid}`, 'fetchPost', commit);
    },
    // 编辑后更新文章
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      });
    },
    // 发布文章
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      });
    }
  },
  getters: {
    getColumns: state => {
      return objToArr(state.columns);
    },
    getColumnById(state) {
      return (id: string) => {
        return state.columns[id];
      };
    },
    getPostsByCid: state => (cid: string) => {
      return objToArr(state.posts).filter(post => post.column === cid);
    },
    getCurrentPost: state => (pid: string) => {
      return state.posts[pid];
    }
  }
});

export default store;
