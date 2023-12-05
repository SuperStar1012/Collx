import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isServerMaintenance: false,
};

const maintenance = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setServerMaintenance: () => {},
    setServerMaintenanceSuccess: (state, {payload}) => {
      state.isServerMaintenance = payload;
    },
    setServerMaintenanceFailure: () => {
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default maintenance;
