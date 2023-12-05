import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  pushNotificationRequestType: null,
  permissionCheckAllow: false,
};

const notification = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setPushNotificationAsk: () => {},
    setPushNotificationAskSuccess: (state, {payload}) => {
      state.pushNotificationRequestType = payload;
    },
    setPushNotificationAskFailure: () => {},
    setPermissionCheckAllow: () => {},
    setPermissionCheckAllowSuccess: (state, {payload}) => {
      state.permissionCheckAllow = payload;
    },
    setPermissionCheckAllowFailure: () => {},
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default notification;
