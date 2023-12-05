import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetchingProducts: false,
  products: [],
  isFetchingReleaseNote: false,
  releaseNote: null,
  isFetchingPosts: false,
  posts: [],
  errorText: '',
};

const strapi = createSlice({
  name: 'strapi',
  initialState,
  reducers: {
    getProducts: (state) => {
      state.isFetchingProducts = true;
      state.products = [];
      state.errorText = '';
    },
    getProductsSuccess: (state, {payload}) => {
      state.isFetchingProducts = false;
      state.products = payload || [];
    },
    getProductsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingProducts = false;
      state.errorText = errorText;
    },
    getReleaseNote: (state) => {
      state.releaseNote = null;
      state.isFetchingReleaseNote = true;
      state.errorText = '';
    },
    getReleaseNoteSuccess: (state, {payload}) => {
      state.isFetchingReleaseNote = false;
      state.releaseNote = payload;
    },
    getReleaseNoteFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingReleaseNote = false;
      state.errorText = errorText;
    },
    getPosts: (state) => {
      state.isFetchingPosts = true;
      state.posts = [];
      state.errorText = '';
    },
    getPostsSuccess: (state, {payload}) => {
      state.isFetchingPosts = false;
      state.posts = payload || [];
    },
    getPostsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingPosts = false;
      state.errorText = errorText;
    },

  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default strapi;
