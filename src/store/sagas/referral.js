import {put, call, takeEvery} from 'redux-saga/effects';

import {referral} from '../stores';
import {getReferrals, setReferral, setReward} from '../apis';

function* getReferralsSaga({payload}) {
  try {
    const result = yield call(getReferrals, payload);
    yield put(referral.actions.getReferralsSuccess({query: payload, result}));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(referral.actions.getReferralsFailure({errorText}));
  }
}

function* setReferralSaga({payload}) {
  try {
    const result = yield call(setReferral, payload);
    yield put(referral.actions.setReferralSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(referral.actions.setReferralFailure({errorText}));
  }
}

function* setRewardSaga({payload}) {
  try {
    const result = yield call(setReward, payload);
    yield put(referral.actions.setRewardSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(referral.actions.setRewardFailure({errorText}));
  }
}

export default function* referralSaga() {
  yield takeEvery(referral.actions.getReferrals, getReferralsSaga);
  yield takeEvery(referral.actions.setReferral, setReferralSaga);
  yield takeEvery(referral.actions.setReward, setRewardSaga);
}
