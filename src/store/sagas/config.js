import {put, call, takeEvery} from 'redux-saga/effects';

import {config} from '../stores';
import {getConfig} from '../apis';

function* getConfigSaga({payload}) {
  try {
    const result = yield call(getConfig, payload);
    yield put(config.actions.getConfigSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(config.actions.getConfigFailure({errorText}));
  }
}

export default function* configSaga() {
  yield takeEvery(config.actions.getConfig, getConfigSaga);
}
