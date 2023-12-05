import {put, call, takeEvery} from 'redux-saga/effects';

import {friend} from '../stores';
import {getFriends, getTopFriends, getHashFriends} from '../apis';

function* getFriendsSaga({payload}) {
  try {
    const result = yield call(getFriends, payload);
    yield put(friend.actions.getFriendsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(friend.actions.getFriendsFailure({errorText}));
  }
}

function* getTopFriendsSaga({payload}) {
  try {
    const result = yield call(getTopFriends, payload);
    yield put(friend.actions.getTopFriendsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(friend.actions.getTopFriendsFailure({errorText}));
  }
}

function* getHashFriendsSaga({payload}) {
  try {
    const result = yield call(getHashFriends, payload);
    yield put(friend.actions.getHashFriendsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(friend.actions.getHashFriendsFailure({errorText}));
  }
}

export default function* friendSaga() {
  yield takeEvery(friend.actions.getFriends, getFriendsSaga);
  yield takeEvery(friend.actions.getTopFriends, getTopFriendsSaga);
  yield takeEvery(friend.actions.getHashFriends, getHashFriendsSaga);
}
