import {put, call, takeEvery} from 'redux-saga/effects';

import {address} from '../stores';
import {getAddresses} from '../apis';

function* getAddressesSaga({payload}) {
  try {
    const result = yield call(getAddresses, payload);
    yield put(address.actions.getAddressesSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(address.actions.getAddressesFailure({errorText}));
  }
}

export default function* addressSaga() {
  yield takeEvery(address.actions.getAddresses, getAddressesSaga);
}
