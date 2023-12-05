import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  typeYears: [],
};

const type = createSlice({
  name: 'type',
  initialState,
  reducers: {
    getTypeYears: state => {
      state.isFetching = true;
      state.typeYears = [];
      state.errorText = '';
    },
    getTypeYearsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.typeYears = payload;
    },
    getTypeYearsFailure: (state, {payload}) => {
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

export default type;
