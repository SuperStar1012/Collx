import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  sets: [],
};

const set = createSlice({
  name: 'set',
  initialState,
  reducers: {
    getSets: state => {
      state.sets = [];
      state.isFetching = true;
      state.errorText = '';
    },
    getSetsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.sets.push(...payload);
    },
    getSetsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default set;
