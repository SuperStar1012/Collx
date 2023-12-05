import {put, call, takeEvery} from 'redux-saga/effects';

import {type} from '../stores';
import {getTypeYears} from '../apis';

function* getTypeYearsSaga({payload}) {
  try {
    const result = yield call(getTypeYears, payload);
    yield put(type.actions.getTypeYearsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(type.actions.getTypeYearsFailure({errorText}));
  }
}

export default function* typeSaga() {
  yield takeEvery(type.actions.getTypeYears, getTypeYearsSaga);
}
