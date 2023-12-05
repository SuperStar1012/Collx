import {put, takeEvery} from 'redux-saga/effects';

import {search} from '../stores';

function* setSearchModalModeSaga({payload}) {
  try {
    yield put(search.actions.setSearchModalModeSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(search.actions.setSearchModalModeFailure());
  }
}

function* setHandleSearchBackSaga({payload}) {
  try {
    yield put(search.actions.setHandleSearchBackSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(search.actions.setHandleSearchBackFailure());
  }
}

function* setSearchCategorySaga({payload}) {
  try {
    yield put(search.actions.setSearchCategorySuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(search.actions.setSearchCategoryFailure());
  }
}

function* setMainFilterOptionsSaga({payload}) {
  try {
    yield put(search.actions.setMainFilterOptionsSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(search.actions.setMainFilterOptionsFailure());
  }
}

function* setModalFilterOptionsSaga({payload}) {
  try {
    yield put(search.actions.setModalFilterOptionsSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(search.actions.setModalFilterOptionsFailure());
  }
}

export default function* searchSaga() {
  yield takeEvery(search.actions.setSearchModalMode, setSearchModalModeSaga);
  yield takeEvery(search.actions.setHandleSearchBack, setHandleSearchBackSaga);
  yield takeEvery(search.actions.setSearchCategory, setSearchCategorySaga);
  yield takeEvery(search.actions.setMainFilterOptions, setMainFilterOptionsSaga);
  yield takeEvery(search.actions.setModalFilterOptions, setModalFilterOptionsSaga);
}
