import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  errorText: '',
  installations: null,
};

const installation = createSlice({
  name: 'installation',
  initialState,
  reducers: {
    getInstallations: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    getInstallationsSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.installations = payload || [];
    },
    getInstallationsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    createInstallation: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    createInstallationSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.installations.push(payload);
    },
    createInstallationFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    updateInstallation: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    updateInstallationSuccess: (state, {payload}) => {
      state.isFetching = false;
      const index = state.installations.findIndex(
        item => item.deviceId === payload.deviceId,
      );

      if (index > -1) {
        state.installations[index] = {
          ...state.installations[index],
          ...payload,
        };
      }
    },
    updateInstallationFailure: (state, {payload}) => {
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

export default installation;
