import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isFetching: false,
  errorText: '',
  config: null,
};

const config = createSlice({
  name: 'config',
  initialState,
  reducers: {
    getConfig: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    getConfigSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.config = payload;
    },
    getConfigFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
  },
});

export default config;
