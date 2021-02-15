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

export interface GlobalColumnProps {
  data: ListProps<ColumnProps>;
  currentPage: number;
  total?: number;
}

export interface GlobalPostsProps {
  data: ListProps<PostProps>;
  loadedColumns: ListProps<{ total?: number; currentPage?: number }>;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  loading: boolean;
  columns: GlobalColumnProps;
  posts: GlobalPostsProps;
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
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any
) => {
  const { data } = await axios(url, config);
  if (extraData) {
    commit(mutationName, { data, extraData });
  } else {
    commit(mutationName, data);
  }
  return data;
};
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0 },
    posts: { data: {}, loadedColumns: {} },
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
      state.posts.data[newPost._id] = newPost;
    },
    fetchColumns(state, rawData) {
      const { data } = state.columns;
      const { list, count, currentPage } = rawData.data;
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      };
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data;
    },
    fetchPosts(state, { data: rawData, extraData }) {
      const { data, loadedColumns } = state.posts;
      const { list, count, currentPage } = rawData.data;
      const listData = list as PostProps[];
      // 如果请求完一个column，再请求另一个column 会把第一个column里面的data扔掉。所以需要合并原始对象。展开语法。
      state.posts.data = {
        ...data,
        ...arrToObj(listData)
      };
      // 缓存的columns。 对象的形式，每个columnId对应一个包含total和currentPage的对象。
      loadedColumns[extraData] = {
        total: count,
        currentPage
      };
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
      state.posts.data[rawData.data._id] = rawData.data;
    },
    updatePost(state, { data }) {
      state.posts.data[data._id] = data;
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id];
    }
  },
  actions: {
    // 使用 es7 async 和await 简化异步写法
    /*  async fetchColumns(ctx) {
      const { data } = await axios.get('./columns');
      ctx.commit('fetchColumns', data);
    }, */
    // 使用封装过的函数发起axios请求
    fetchColumns({ state, commit }, params = {}) {
      // ，params默认是个空对象。解构赋值
      const { currentPage = 1, pageSize = 3 } = params;
      if (state.columns.currentPage < currentPage) {
        return getAndCommit(
          `/columns?currentPage=${currentPage}&pageSize=${pageSize}`,
          'fetchColumns',
          commit
        );
      }
    },
    fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit);
      }
    },
    fetchPosts({ state, commit }, params = {}) {
      const { cid, currentPage = 1, pageSize = 3 } = params;
      const { loadedColumns } = state.posts;
      // 某个确定id的column已经加载到的page
      const loadedCurrentPage =
        (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0;
      if (
        !Object.keys(loadedColumns).includes(cid) ||
        loadedCurrentPage < currentPage
      ) {
        return asyncAndCommit(
          `/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          'fetchPosts',
          commit,
          { method: 'get' },
          cid
        );
      }
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload);
    },
    // 退出登陆
    logout({ commit }) {
      return asyncAndCommit(
        // 测试接口可用
        `/columns?currentPage=1&pageSize=3`,
        'logout',
        commit
      );
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
    fetchPost({ state, commit }, pid) {
      // 由于fetchPosts 也会改变state.posts.data, 但是fetchPosts和fetchPost改变的state.posts.data 里面的数据是不一样的。fetchPost返回的data带有content。
      const currentPost = state.posts.data[pid];
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${pid}`, 'fetchPost', commit);
      } else {
        // 如果从缓存里获取，则没有Promise对象
        // createPost.vue  里面需要dispatch后面的then方法处理promise对象
        return Promise.resolve({ data: currentPost });
      }
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
      return objToArr(state.columns.data);
    },
    getColumnById(state) {
      return (id: string) => {
        return state.columns.data[id];
      };
    },
    getPostsByCid: state => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid);
    },
    getCurrentPost: state => (pid: string) => {
      return state.posts.data[pid];
    },
    // 已明确cid的column，post的总数
    getPostsCountByCid: state => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].total;
      } else {
        return 0;
      }
    },
    // 确定cid的column 当前加载到的页数
    getPostsCurrentPageByCid: state => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].currentPage;
      } else {
        return 0;
      }
    }
  }
});

export default store;
