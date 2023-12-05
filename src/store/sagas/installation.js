import {put, call, takeEvery} from 'redux-saga/effects';

import {installation} from '../stores';
import {
  getInstallations,
  createInstallation,
  updateInstallation,
} from '../apis';

function* getInstallationsSaga({payload}) {
  try {
    const result = yield call(getInstallations, payload);
    yield put(installation.actions.getInstallationsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(installation.actions.getInstallationsFailure({errorText}));
  }
}

function* createInstallationSaga({payload}) {
  try {
    const result = yield call(createInstallation, payload);
    yield put(installation.actions.createInstallationSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(installation.actions.createInstallationFailure({errorText}));
  }
}

function* updateInstallationSaga({payload}) {
  try {
    const result = yield call(updateInstallation, payload);
    yield put(installation.actions.updateInstallationSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(installation.actions.updateInstallationFailure({errorText}));
  }
}

export default function* installationSaga() {
  yield takeEvery(installation.actions.getInstallations, getInstallationsSaga);
  yield takeEvery(
    installation.actions.createInstallation,
    createInstallationSaga,
  );
  yield takeEvery(
    installation.actions.updateInstallation,
    updateInstallationSaga,
  );
}
