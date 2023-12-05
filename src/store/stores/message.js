import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  unreadMessageCount: 0,
  users: [],
  connectedChatClient: null,
};

const message = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setUnreadCount: () => {},
    setUnreadCountSuccess: (state, {payload}) => {
      state.unreadMessageCount = payload;
    },
    setChatClient: () => {},
    setChatClientSuccess: (state, {payload}) => {
      state.connectedChatClient = payload;
    },
    getUsers: (state, {payload}) => {
      const {offset} = payload;
      if (offset === 0) {
        state.users = [];
      }

      state.isFetching = true;
      state.errorText = '';
    },
    getUsersSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.users.push(...payload);
    },
    getUsersFailure: (state, {payload}) => {
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

export default message;
