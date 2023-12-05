import {put, call, takeEvery} from 'redux-saga/effects';

import {stripe} from '../stores';
import {
  getAccount,
  updateAccount,
  updateCustomer,
  getPaymentMethod,
  getPaymentMethods,
  attachPaymentMethod,
  detachPaymentMethod,
  createBankAccount,
  deleteBankAccount,
  getBankAccounts,
  updateBankAccount,
} from '../apis';
import {getBuyerSettings} from '../relay';

function* updateCustomerSaga({payload}) {
  try {
    const {customerId, params} = payload;
    const result = yield call(updateCustomer, customerId, params);
    yield call(getBuyerSettings);
    yield put(stripe.actions.updateCustomerSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.updateCustomerFailure({errorText}));
  }
}

function* getAccountSaga({payload}) {
  try {
    const result = yield call(getAccount, payload);
    yield put(stripe.actions.getAccountSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.getAccountFailure({errorText}));
  }
}

function* updateAccountSaga({payload}) {
  try {
    const {stripeConnectedAccountId, params} = payload;
    const result = yield call(updateAccount, stripeConnectedAccountId, params);
    yield put(stripe.actions.updateAccountSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.updateAccountFailure({errorText}));
  }
}

function* getPaymentMethodSaga({payload}) {
  try {
    const result = yield call(getPaymentMethod, payload);
    yield put(stripe.actions.getPaymentMethodSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.getPaymentMethodFailure({errorText}));
  }
}

function* getPaymentMethodsSaga({payload}) {
  try {
    const result = yield call(getPaymentMethods, payload);
    yield put(stripe.actions.getPaymentMethodsSuccess(result?.data || []));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.getPaymentMethodsFailure({errorText}));
  }
}

function* attachPaymentMethodSaga({payload}) {
  try {
    const {paymentMethodId, customerId} = payload;
    const result = yield call(attachPaymentMethod, paymentMethodId, customerId);
    yield put(stripe.actions.attachPaymentMethodSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.attachPaymentMethodFailure({errorText}));
  }
}

function* detachPaymentMethodSaga({payload}) {
  try {
    yield call(detachPaymentMethod, payload);
    yield call(getBuyerSettings);
    yield put(stripe.actions.detachPaymentMethodSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.detachPaymentMethodFailure({errorText}));
  }
}

function* createBankAccountSaga({payload}) {
  try {
    const {stripeConnectedAccountId, externalAccount} = payload;
    const result = yield call(createBankAccount, stripeConnectedAccountId, externalAccount);
    yield put(stripe.actions.createBankAccountSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.createBankAccountFailure({errorText}));
  }
}

function* deleteBankAccountSaga({payload}) {
  try {
    const {stripeConnectedAccountId, bankAccountId} = payload;
    yield call(deleteBankAccount, stripeConnectedAccountId, bankAccountId);
    yield put(stripe.actions.deleteBankAccountSuccess(bankAccountId));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.deleteBankAccountFailure({errorText}));
  }
}

function* updateBankAccountSaga({payload}) {
  try {
    const {stripeConnectedAccountId, bankAccountId, externalAccount} = payload;
    const result = yield call(updateBankAccount, stripeConnectedAccountId, bankAccountId, externalAccount);
    yield put(stripe.actions.updateBankAccountSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.updateBankAccountFailure({errorText}));
  }
}

function* getBankAccountsSaga({payload}) {
  try {
    const result = yield call(getBankAccounts, payload);
    yield put(stripe.actions.getBankAccountsSuccess(result?.data || []));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(stripe.actions.getBankAccountsFailure({errorText}));
  }
}

export default function* stripeSaga() {
  yield takeEvery(stripe.actions.getAccount, getAccountSaga);
  yield takeEvery(stripe.actions.updateAccount, updateAccountSaga);
  yield takeEvery(stripe.actions.updateCustomer, updateCustomerSaga);
  yield takeEvery(stripe.actions.getPaymentMethod, getPaymentMethodSaga);
  yield takeEvery(stripe.actions.getPaymentMethods, getPaymentMethodsSaga);
  yield takeEvery(stripe.actions.attachPaymentMethod, attachPaymentMethodSaga);
  yield takeEvery(stripe.actions.detachPaymentMethod, detachPaymentMethodSaga);
  yield takeEvery(stripe.actions.createBankAccount, createBankAccountSaga);
  yield takeEvery(stripe.actions.deleteBankAccount, deleteBankAccountSaga);
  yield takeEvery(stripe.actions.updateBankAccount, updateBankAccountSaga);
  yield takeEvery(stripe.actions.getBankAccounts, getBankAccountsSaga);
}
