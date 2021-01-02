import { createStore, Commit } from 'vuex';
import axios from 'axios';

interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt?: string;
  column: string;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}
export interface GlobalErrorProps {
  // true 表示错误存在
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
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
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    /*  login(state) {
      state.user = {
        ...state.user,
        //  向前覆盖！！！
        // es6 标准入门: 如果用户自定义的属性放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖。
        isLogin: true,
        name: 'viking'
      };
    }, */
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list;
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data];
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list;
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
      getAndCommit('/columns', 'fetchColumns', commit);
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
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
    },
    fetchPosts({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchColumn', commit);
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload);
    },
    fetchCurrentUser({ commit }) {
      getAndCommit('/user/current', 'fetchCurrentUser', commit);
    },
    // 组合action 处理复杂异步
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser');
      });
    }
  },
  getters: {
    getColumnById(state) {
      return (id: string) => {
        return state.columns.find(c => c._id === id);
      };
    },
    getPostsByCid: state => (cid: string) => {
      return state.posts.filter(post => post.column === cid);
    }
  }
});

export default store;
