import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

import user from './user';

const initialState = {
  isFetchingAccount: false,
  isUpdatingAccount: false,
  isUpdatingCustomer: false,
  isFetchingPaymentMethod: false,
  isFetchingPaymentMethods: false,
  isAttachingPaymentMethod: false,
  isDetachingPaymentMethod: false,
  isFetchingBankAccounts: false,
  isCreatingBankAccount: false,
  isDeletingBankAccount: false,
  isUpdatingBankAccount: false,
  errorText: '',
  account: null,
  customer: null,
  paymentMethods: [],
  otherPaymentMethods: [],
  bankAccounts: [],
};

const stripe = createSlice({
  name: 'stripe',
  initialState,
  reducers: {
    getAccount: state => {
      state.isFetchingAccount = true;
      state.errorText = '';
    },
    getAccountSuccess: (state, {payload}) => {
      state.isFetchingAccount = false;
      state.account = payload;
    },
    getAccountFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingAccount = false;
      state.errorText = errorText;
    },
    updateAccount: state => {
      state.isUpdatingAccount = true;
      state.errorText = '';
    },
    updateAccountSuccess: (state, {payload}) => {
      state.isUpdatingAccount = false;
      state.account = payload;
    },
    updateAccountFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isUpdatingAccount = false;
      state.errorText = errorText;
    },
    updateCustomer: state => {
      state.isUpdatingCustomer = true;
      state.errorText = '';
    },
    updateCustomerSuccess: (state, {payload}) => {
      state.isUpdatingCustomer = false;
      state.customer = payload;
    },
    updateCustomerFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isUpdatingCustomer = false;
      state.errorText = errorText;
    },
    getPaymentMethods: state => {
      state.isFetchingPaymentMethods = true;
      state.paymentMethods = [];
      state.errorText = '';
    },
    getPaymentMethodsSuccess: (state, {payload}) => {
      state.isFetchingPaymentMethods = false;
      state.paymentMethods = payload;
    },
    getPaymentMethodsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingPaymentMethods = false;
      state.errorText = errorText;
    },
    getPaymentMethod: state => {
      state.isFetchingPaymentMethod = true;
      state.errorText = '';
    },
    getPaymentMethodSuccess: (state, {payload}) => {
      state.isFetchingPaymentMethod = false;

      const index = state.otherPaymentMethods.findIndex(item => item.id === payload?.id);
      if (index === -1 && payload) {
        state.otherPaymentMethods.push(payload);
      }
    },
    getPaymentMethodFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingPaymentMethod = false;
      state.errorText = errorText;
    },
    attachPaymentMethod: state => {
      state.isAttachingPaymentMethod = true;
      state.errorText = '';
    },
    attachPaymentMethodSuccess: (state, {payload}) => {
      state.isAttachingPaymentMethod = false;
      state.paymentMethods.unshift(payload);
    },
    attachPaymentMethodFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isAttachingPaymentMethod = false;
      state.errorText = errorText;
    },
    detachPaymentMethod: state => {
      state.isDetachingPaymentMethod = true;
      state.errorText = '';
    },
    detachPaymentMethodSuccess: (state, {payload}) => {
      state.isDetachingPaymentMethod = false;
      state.paymentMethods = state.paymentMethods.filter(item => item.id !== payload);
    },
    detachPaymentMethodFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isDetachingPaymentMethod = false;
      state.errorText = errorText;
    },
    createBankAccount: state => {
      state.isCreatingBankAccount = true;
      state.errorText = '';
    },
    createBankAccountSuccess: (state, {payload}) => {
      state.isCreatingBankAccount = false;
      state.bankAccounts.unshift(payload);
      state.bankAccounts = _.orderBy(state.bankAccounts || [], ['default_for_currency'], ['desc']);
    },
    createBankAccountFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isCreatingBankAccount = false;
      state.errorText = errorText;
    },
    deleteBankAccount: state => {
      state.isDeletingBankAccount = true;
      state.errorText = '';
    },
    deleteBankAccountSuccess: (state, {payload}) => {
      state.isDeletingBankAccount = false;
      state.bankAccounts = state.bankAccounts.filter(item => item.id !== payload);
    },
    deleteBankAccountFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isDeletingBankAccount = false;
      state.errorText = errorText;
    },
    updateBankAccount: state => {
      state.isUpdatingBankAccount = true;
      state.errorText = '';
    },
    updateBankAccountSuccess: (state, {payload}) => {
      state.isUpdatingBankAccount = false;
      const index = state.bankAccounts.findIndex(item => item.id === payload.id);
      if (index > -1) {
        const banks = [...state.bankAccounts];

        if (payload?.default_for_currency) {
          banks?.map((item, index) => {
            banks[index].default_for_currency = false;
          })
        }

        banks[index] = payload;

        state.bankAccounts = _.orderBy(banks || [], ['default_for_currency'], ['desc']);
      }
    },
    updateBankAccountFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isUpdatingBankAccount = false;
      state.errorText = errorText;
    },
    getBankAccounts: state => {
      state.isFetchingBankAccounts = true;
      state.bankAccounts = [];
      state.errorText = '';
    },
    getBankAccountsSuccess: (state, {payload}) => {
      state.isFetchingBankAccounts = false;
      state.bankAccounts = _.orderBy(payload || [], ['default_for_currency'], ['desc']);
    },
    getBankAccountsFailure: (state, {payload}) => {
      const {errorText} = payload;
      state.isFetchingBankAccounts = false;
      state.errorText = errorText;
    },
  },
  extraReducers: builder => {
    builder.addCase(user.actions.signOut, () => {
      return initialState;
    });
  },
});

export default stripe;
