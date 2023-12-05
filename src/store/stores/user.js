import {createSlice} from '@reduxjs/toolkit';

import {Constants} from 'globals';

const initialState = {
  isFetching: false,
  isUpdatingUser: false,
  isUploadingAvatar: false,
  isDeletingUser: false,
  errorText: {},
  user: {},
  lookup: null,
  lookedupSocial: null,
  isAuthenticated: false,
  isCompletedSignUp: false,
  isNewUser: false,
  pushToken: null,
  appearanceMode: Constants.appearanceSettings.system,
  cameraSoundEffect: Constants.soundEffectSettings.on,

  isFetchingFollowAndUnfollow: false,
  isFetchingBlockAndUnblock: false,
  isFetchingOtherUsers: false,
  otherUsers: [], // search users
  profileUsers: {}, // profile users
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: state => {
      state.isFetching = true;
      state.user = {};
      state.errorText = {};
    },
    signInSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.user = payload;
      state.isAuthenticated = !!payload.name;
    },
    signInFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.signIn = errorText;
    },
    signUp: (state, {payload}) => {
      state.isFetching = true;
      state.user = {};
      state.errorText = {};
      state.isAuthenticated = !!payload.anonymous;
    },
    signUpSuccess: (state, {payload}) => {
      const {userRequest, userResult} = payload;

      state.isFetching = false;
      state.isAuthenticated = !!userRequest.anonymous || !!userResult.name;
      state.isNewUser = true;
      state.user = userResult;
    },
    signUpFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.signUp = errorText;
    },
    signUpComplete: state => {
      state.errorText = {};
    },
    signUpCompleteSuccess: state => {
      state.isAuthenticated = true;
      state.isCompletedSignUp = true;
    },
    signUpCompleteFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.signUpComplete = errorText;
    },
    resetSignUp: () => {},
    resetSignUpSuccess: state => {
      state.isAuthenticated = false;
      state.isCompletedSignUp = false;
    },
    resetSignUpFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.errorText.resetSignUp = errorText;
    },
    lookUp: state => {
      state.isFetching = true;
      state.lookup = null;
      state.isAuthenticated = false;
      state.errorText = {};
    },
    lookUpSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.lookup = payload;
    },
    lookUpFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.lookUp = errorText;
    },
    lookUpSocial: state => {
      state.isFetching = true;
      state.lookedupSocial = null;
      state.isAuthenticated = false;
      state.errorText = {};
    },
    lookUpSocialSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.lookedupSocial = payload;
    },
    lookUpSocialFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.lookUpSocial = errorText;
    },
    updateUser: state => {
      state.isUpdatingUser = true;
      state.errorText = {};
    },
    updateUserSuccess: (state, {payload}) => {
      state.isUpdatingUser = false;
      state.user = payload;
    },
    updateUserFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isUpdatingUser = false;
      state.errorText.updateUser = errorText;
    },
    createLink: state => {
      state.isFetching = true;
      state.errorText = {};
    },
    createLinkSuccess: (state) => {
      state.isFetching = false;
    },
    createLinkFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.createLink = errorText;
    },
    resetPassword: state => {
      state.isFetching = true;
      state.errorText = {};
    },
    resetPasswordSuccess: (state) => {
      state.isFetching = false;
    },
    resetPasswordFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.resetPassword = errorText;
    },
    setPushToken: state => {
      state.errorText = {};
    },
    setPushTokenSuccess: (state, {payload}) => {
      state.pushToken = payload;
    },
    setPushTokenFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.errorText.setPushToken = errorText;
    },
    uploadAvatar: state => {
      state.isUploadingAvatar = true;
      state.errorText = {};
    },
    uploadAvatarSuccess: (state, {payload}) => {
      state.isUploadingAvatar = false;
      state.user = {
        ...state.user,
        ...payload,
      };
    },
    uploadAvatarFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isUploadingAvatar = false;
      state.errorText.uploadAvatar = errorText;
    },
    updatePassword: state => {
      state.isFetching = true;
      state.errorText = {};
    },
    updatePasswordSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.user = payload;
    },
    updatePasswordFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText.updatePassword = errorText;
    },
    setAppearanceMode: () => {},
    setAppearanceModeSuccess: (state, {payload}) => {
      state.appearanceMode = payload || Constants.appearanceSettings.system;
    },
    setAppearanceModeFailure: () => {},
    setCameraSoundEffect: () => {},
    setCameraSoundEffectSuccess: (state, {payload}) => {
      state.cameraSoundEffect = payload || Constants.soundEffectSettings.on;
    },
    setCameraSoundEffectFailure: () => {},
    deleteUser: state => {
      state.isDeletingUser = true;
      state.errorText = {};
    },
    deleteUserSuccess: (state) => {
      state.isDeletingUser = false;
    },
    deleteUserFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isDeletingUser = false;
      state.errorText.deleteUser = errorText;
    },
    signOut: () => {},
    signOutSuccess: state => {
      state.isFetching = false;
      state.isUpdatingUser = false;
      state.errorText = {};
      state.user = {};
      state.lookup = null;
      state.lookedupSocial = null;
      state.isAuthenticated = false;
      state.isCompletedSignUp = false;
      state.isNewUser = false;
      state.pushToken = null;

      state.isFetchingFollowAndUnfollow = false;
      state.isFetchingBlockAndUnblock = false;
      state.isFetchingOtherUsers = false;
      state.otherUsers = [];
      state.profileUsers = {};
    },

    setFollow: state => {
      state.errorText = {};
      state.isFetchingFollowAndUnfollow = true;
    },
    setFollowSuccess: (state, {payload}) => {
      const {userId, enabled} = payload;
      state.isFetchingFollowAndUnfollow = false;

      const followingCount = state.user.followingCount + 1;
      state.user = {
        ...state.user,
        followingCount,
      };

      const profiledUser = state.profileUsers[userId];
      if (profiledUser) {
        state.profileUsers[userId] = {
          ...profiledUser,
          followed: enabled,
        };
      }

      const otherIndex = state.otherUsers.findIndex(item => item.id === userId);
      if (otherIndex > -1) {
        state.otherUsers[otherIndex] = {
          ...state.otherUsers[otherIndex],
          followed: enabled,
        };
      }
    },
    setFollowFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingFollowAndUnfollow = false;
      state.errorText.setFollow = errorText;
    },
    setBlock: state => {
      state.errorText = {};
      state.isFetchingBlockAndUnblock = true;
    },
    setBlockSuccess: (state, {payload}) => {
      const {userId, enabled} = payload;
      state.isFetchingBlockAndUnblock = false;

      const profiledUser = state.profileUsers[userId];
      if (profiledUser) {
        state.profileUsers[userId] = {
          ...profiledUser,
          followed: enabled,
        };
      }

      const otherIndex = state.otherUsers.findIndex(item => item.id === userId);
      if (otherIndex > -1) {
        state.otherUsers[otherIndex] = {
          ...state.otherUsers[otherIndex],
          blocking: enabled,
        };
      }
    },
    setBlockFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingBlockAndUnblock = false;
      state.errorText.setBlock = errorText;
    },
    getUsers: (state, {payload}) => {
      const {offset} = payload;
      if (offset === 0) {
        state.otherUsers = [];
      }

      state.isFetchingOtherUsers = true;
      state.errorText = {};
    },
    getUsersSuccess: (state, {payload}) => {
      state.isFetchingOtherUsers = false;
      state.otherUsers.push(...payload);
    },
    getUsersFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingOtherUsers = false;
      state.errorText.getUsers = errorText;
    },
  },
});

export default user;
