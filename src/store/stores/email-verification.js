import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  verifiedAction: null,
  isEmailVerified: false,
};

const emailVerification = createSlice({
  name: 'emailVerification',
  initialState,
  reducers: {
    setEmailVerifiedAction: () => {},
    setEmailVerifiedActionSuccess: (state, {payload}) => {
      state.verifiedAction = payload;
    },
    setEmailVerifiedActionFailure: () => {},
    setEmailVerified: () => {},
    setEmailVerifiedSuccess: (state, {payload}) => {
      state.isEmailVerified = payload;
    },
    setEmailVerifiedFailure: () => {},
  },
});

export default emailVerification;
