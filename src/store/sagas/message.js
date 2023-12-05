import {put, call, takeEvery} from 'redux-saga/effects';

import {getUsers} from '../apis';
import {message} from '../stores';

function* setUnreadCountSaga({payload}) {
  try {
    yield put(message.actions.setUnreadCountSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
  }
}

function* setChatClientSaga({payload}) {
  try {
    yield put(message.actions.setChatClientSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
  }
}

function* getUsersSaga({payload}) {
  try {
    const result = yield call(getUsers, payload);
    yield put(message.actions.getUsersSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(message.actions.getUsersFailure({errorText}));
  }
}

export default function* messageSaga() {
  yield takeEvery(message.actions.setUnreadCount, setUnreadCountSaga);
  yield takeEvery(message.actions.setChatClient, setChatClientSaga);
  yield takeEvery(message.actions.getUsers, getUsersSaga);
}
