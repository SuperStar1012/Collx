import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  friends: [],
  topFriends: [],
  hashFriends: [], // contact friends
};

const friend = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    getFriends: (state, {payload}) => {
      const {offset} = payload;
      if (offset === 0) {
        state.friends = [];
      }

      state.isFetching = true;
      state.errorText = '';
    },
    getFriendsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.friends.push(...payload);
    },
    getFriendsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    getTopFriends: (state) => {
      state.isFetching = true;
      state.errorText = '';
    },
    getTopFriendsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.topFriends = payload;
    },
    getTopFriendsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    getHashFriends: state => {
      state.hashFriends = [];
      state.isFetching = true;
      state.errorText = '';
    },
    getHashFriendsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.hashFriends = payload;
    },
    getHashFriendsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    setFollowSuccess: (state, {payload}) => {
      const {userId, enabled} = payload;

      const friendIndex = state.friends.findIndex(item => item.id === userId);
      if (friendIndex > -1) {
        state.friends[friendIndex] = {
          ...state.friends[friendIndex],
          followed: enabled,
        };
      }

      const topFriendIndex = state.topFriends.findIndex(
        item => item.id === userId,
      );
      if (topFriendIndex > -1) {
        state.topFriends[topFriendIndex] = {
          ...state.topFriends[topFriendIndex],
          followed: enabled,
        };
      }

      const hashFriendIndex = state.hashFriends.findIndex(
        item => item.id === userId,
      );
      if (hashFriendIndex > -1) {
        state.hashFriends[hashFriendIndex] = {
          ...state.hashFriends[hashFriendIndex],
          followed: enabled,
        };
      }
    },
    setBlockSuccess: (state, {payload}) => {
      const {userId, enabled} = payload;

      const friendIndex = state.friends.findIndex(item => item.id === userId);
      if (friendIndex > -1) {
        state.friends[friendIndex] = {
          ...state.friends[friendIndex],
          blocking: enabled,
        };
      }

      const topFriendIndex = state.topFriends.findIndex(
        item => item.id === userId,
      );
      if (topFriendIndex > -1) {
        state.topFriends[topFriendIndex] = {
          ...state.topFriends[topFriendIndex],
          blocking: enabled,
        };
      }

      const hashFriendIndex = state.hashFriends.findIndex(
        item => item.id === userId,
      );
      if (hashFriendIndex > -1) {
        state.hashFriends[hashFriendIndex] = {
          ...state.hashFriends[hashFriendIndex],
          blocking: enabled,
        };
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default friend;
