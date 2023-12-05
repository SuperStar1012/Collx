import {createSlice} from '@reduxjs/toolkit';

import user from './user';
import {Constants} from 'globals';

const initialState = {
  isFetching: false,
  errorText: '',
  approvedReferrals: [],
  claimedReferrals: [],
  newReferral: null,
  newReward: null,
};

const referral = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    getReferrals: state => {
      state.isFetching = true;
      state.errorText = '';
    },
    getReferralsSuccess: (state, {payload}) => {
      const {query, result} = payload;
      state.isFetching = false;

      if (query.status === Constants.referralStatus.approved) {
        if (query.claimed) {
          state.claimedReferrals = result;
        } else {
          state.approvedReferrals = result;
        }
      }
    },
    getReferralsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    setReferral: state => {
      state.isFetching = true;
      state.errorText = '';
      state.newReferral = null;
    },
    setReferralSuccess: (state, {payload}) => {
      state.isFetching = false;
      state.newReferral = payload?.referrer;
    },
    setReferralFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetching = false;
      state.errorText = errorText;
    },
    setReward: state => {
      state.isFetching = true;
      state.errorText = '';
      state.newReward = null;
    },
    setRewardSuccess: (state, {payload}) => {
      const {referrals} = payload;
      state.isFetching = false;
      state.newReward = payload;

      const claimedReferrals = state.approvedReferrals.filter(
        approvedReferral =>
          referrals.findIndex(item => item === approvedReferral.id) > -1,
      );
      state.claimedReferrals = [...state.claimedReferrals, ...claimedReferrals];

      state.approvedReferrals = state.approvedReferrals.filter(
        approvedReferral =>
          referrals.findIndex(item => item === approvedReferral.id) === -1,
      );
    },
    setRewardFailure: (state, {payload}) => {
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

export default referral;
