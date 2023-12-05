import {put, call, takeEvery} from 'redux-saga/effects';

import {collection} from '../stores';
import {
  getExportCollection,
  setExportCollection,
} from '../apis';

function* updateUserCardsCountSaga() {
  try {
    yield put(collection.actions.updateUserCardsCountSuccess());
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(collection.actions.updateUserCardsCountFailure({errorText}));
  }
}

function* getExportCollectionSaga() {
  try {
    const result = yield call(getExportCollection);
    yield put(collection.actions.getExportCollectionSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(collection.actions.getExportCollectionFailure(errorText));
  }
}

function* setExportCollectionSaga({payload}) {
  try {
    const result = yield call(setExportCollection, payload);
    yield put(collection.actions.setExportCollectionSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(collection.actions.setExportCollectionFailure(errorText));
  }
}

function* setPrintChecklistSaga({payload}) {
  try {
    const result = yield call(setExportCollection, payload);
    yield put(collection.actions.setPrintChecklistSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(collection.actions.setPrintChecklistFailure(errorText));
  }
}

export default function* collectionSaga() {
  yield takeEvery(collection.actions.updateUserCardsCount, updateUserCardsCountSaga);
  yield takeEvery(collection.actions.getExportCollection, getExportCollectionSaga);
  yield takeEvery(collection.actions.setExportCollection, setExportCollectionSaga);
  yield takeEvery(collection.actions.setPrintChecklist, setPrintChecklistSaga);
}
