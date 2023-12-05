import {createSlice} from '@reduxjs/toolkit';

import user from './user';

const initialState = {
  isFetchingCustomer: false,
  isFetchingOfferings: false,
  isPurchasingPackage: false,
  isRestoringPurchases: false,
  isSettingSubscription: false,
  errorText: '',
  activeSubscription: null,
  customerInfo: {},
  offerings: [],
};

const subscription = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    getCustomer: state => {
      state.customerInfo = {};
      state.isFetchingCustomer = true;
      state.errorText = '';
    },
    getCustomerSuccess: (state, {payload}) => {
      state.isFetchingCustomer = false;
      state.customerInfo = payload;
      state.activeSubscription = payload?.activeSubscriptions?.length > 0 ? payload.activeSubscriptions[0] : null;
    },
    getCustomerFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingCustomer = false;
      state.errorText = errorText;
    },
    getOfferings: state => {
      state.offerings = [];
      state.isFetchingOfferings = true;
      state.errorText = '';
    },
    getOfferingsSuccess: (state, {payload}) => {
      state.isFetchingOfferings = false;
      state.offerings = payload;
    },
    getOfferingsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingOfferings = false;
      state.errorText = errorText;
    },
    purchasePackage: state => {
      state.customerInfo = {};
      state.isPurchasingPackage = true;
      state.errorText = '';
    },
    purchasePackageSuccess: (state, {payload}) => {
      state.isPurchasingPackage = false;
      state.customerInfo = payload;
      state.activeSubscription = payload?.activeSubscriptions?.length > 0 ? payload.activeSubscriptions[0] : null;
    },
    purchasePackageFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isPurchasingPackage = false;
      state.errorText = errorText;
    },
    restorePurchases: state => {
      state.customerInfo = {};
      state.isRestoringPurchases = true;
      state.errorText = '';
    },
    restorePurchasesSuccess: (state, {payload}) => {
      state.isRestoringPurchases = false;
      state.customerInfo = payload;
      state.activeSubscription = payload?.activeSubscriptions?.length > 0 ? payload.activeSubscriptions[0] : null;
    },
    restorePurchasesFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isRestoringPurchases = false;
      state.errorText = errorText;
    },
    setSubscription: state => {
      state.isSettingSubscription = true;
      state.errorText = '';
    },
    setSubscriptionSuccess: (state) => {
      state.isSettingSubscription = false;
    },
    setSubscriptionFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isSettingSubscription = false;
      state.errorText = errorText;
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default subscription;
