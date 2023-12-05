import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  navigationStyles: {},
  screenOptions: {},
};

const navigationOptions = createSlice({
  name: 'navigationOptions',
  initialState,
  reducers: {
    setNavigationOptions: () => {},
    setNavigationOptionsSuccess: (state, {payload}) => {
      state.navigationStyles = payload.styles || {};
      state.screenOptions = payload.screenOptions || {};
    },
    setNavigationOptionsFailure: () => {
    },
  },
});

export default navigationOptions;
