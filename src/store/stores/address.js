import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetching: false,
  addresses: [],
  errorText: '',
};

const address = createSlice({
  name: 'address',
  initialState,
  reducers: {
    getAddresses: state => {
      state.addresses = [];
      state.isFetching = true;
      state.errorText = '';
    },
    getAddressesSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.addresses.push(...payload);
    },
    getAddressesFailure: (state, {payload}) => {
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

export default address;
