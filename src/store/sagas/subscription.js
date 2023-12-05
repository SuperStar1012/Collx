import {put, call, takeEvery} from 'redux-saga/effects';

import {subscription} from '../stores';
import {
  getCustomer,
  getOfferings,
  purchasePackage,
  restorePurchases,
  setSubscription,
} from '../apis';

function* getCustomerSaga() {
  try {
    const result = yield call(getCustomer);
    yield put(subscription.actions.getCustomerSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(subscription.actions.getCustomerFailure({errorText}));
  }
}

function* getOfferingsSaga() {
  try {
    const result = yield call(getOfferings);
    yield put(subscription.actions.getOfferingsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(subscription.actions.getOfferingsFailure({errorText}));
  }
}

function* purchasePackageSaga({payload}) {
  try {
    const result = yield call(purchasePackage, payload);
    yield put(subscription.actions.purchasePackageSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(subscription.actions.purchasePackageFailure({errorText}));
  }
}

function* restorePurchasesSaga() {
  try {
    const result = yield call(restorePurchases);
    yield put(subscription.actions.restorePurchasesSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(subscription.actions.restorePurchasesFailure({errorText}));
  }
}

function* setSubscriptionSaga({payload}) {
  try {
    const result = yield call(setSubscription, payload);
    yield put(subscription.actions.setSubscriptionSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(subscription.actions.setSubscriptionFailure({errorText}));
  }
}

export default function* subscriptionSaga() {
  yield takeEvery(subscription.actions.getCustomer, getCustomerSaga);
  yield takeEvery(subscription.actions.getOfferings, getOfferingsSaga);
  yield takeEvery(subscription.actions.purchasePackage, purchasePackageSaga);
  yield takeEvery(subscription.actions.restorePurchases, restorePurchasesSaga);
  yield takeEvery(subscription.actions.setSubscription, setSubscriptionSaga);
}
