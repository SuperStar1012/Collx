import {put, call, takeEvery} from 'redux-saga/effects';

import {player} from '../stores';
import {getPlayers, getPlayerYears} from '../apis';

function* getPlayersSaga({payload}) {
  try {
    const result = yield call(getPlayers, payload);
    yield put(player.actions.getPlayersSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(player.actions.getPlayersFailure({errorText}));
  }
}

function* getPlayerYearsSaga({payload}) {
  try {
    const result = yield call(getPlayerYears, payload);
    yield put(player.actions.getPlayerYearsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(player.actions.getPlayerYearsFailure({errorText}));
  }
}

export default function* playerSaga() {
  yield takeEvery(player.actions.getPlayers, getPlayersSaga);
  yield takeEvery(player.actions.getPlayerYears, getPlayerYearsSaga);
}
