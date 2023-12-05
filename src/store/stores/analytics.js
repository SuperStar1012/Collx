import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  event: null,
};

const analytics = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    sendEvent: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    sendEventSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.event = payload;
    },
    sendEventFailure: (state, {payload}) => {
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

export default analytics;
