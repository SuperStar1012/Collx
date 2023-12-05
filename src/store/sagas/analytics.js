import {put, call, takeEvery} from 'redux-saga/effects';

import {analytics} from '../stores';
import {
  sendEvent,
} from '../apis';

function* sendEventSaga({payload}) {
  try {
    const result = yield call(sendEvent, payload);
    yield put(analytics.actions.sendEventSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(analytics.actions.sendEventFailure({errorText}));
  }
}

export default function* installationSaga() {
  yield takeEvery(analytics.actions.sendEvent, sendEventSaga);
}
