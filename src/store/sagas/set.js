import {put, call, takeEvery} from 'redux-saga/effects';

import {set} from '../stores';
import {getSets} from '../apis';

function* getSetsSaga({payload}) {
  try {
    const result = yield call(getSets, payload);
    yield put(set.actions.getSetsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(set.actions.getSetsFailure({errorText}));
  }
}

export default function* setSaga() {
  yield takeEvery(set.actions.getSets, getSetsSaga);
}
