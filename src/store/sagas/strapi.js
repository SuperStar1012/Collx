import {put, call, takeEvery} from 'redux-saga/effects';

import {strapi} from '../stores';
import {
  getProducts,
  getReleaseNote,
  getPosts,
} from '../apis';

function* getProductsSaga() {
  try {
    const result = yield call(getProducts);
    yield put(strapi.actions.getProductsSuccess(result?.data || []));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(strapi.actions.getProductsFailure({errorText}));
  }
}

function* getReleaseNoteSaga() {
  try {
    const result = yield call(getReleaseNote);
    yield put(strapi.actions.getReleaseNoteSuccess(result?.data?.length ? result?.data[0] : null));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(strapi.actions.getReleaseNoteFailure({errorText}));
  }
}

function* getPostsSaga() {
  try {
    const result = yield call(getPosts);
    yield put(strapi.actions.getPostsSuccess(result?.data || []));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(strapi.actions.getPostsFailure({errorText}));
  }
}

export default function* activitySaga() {
  yield takeEvery(strapi.actions.getProducts, getProductsSaga);
  yield takeEvery(strapi.actions.getReleaseNote, getReleaseNoteSaga);
  yield takeEvery(strapi.actions.getPosts, getPostsSaga);
}
