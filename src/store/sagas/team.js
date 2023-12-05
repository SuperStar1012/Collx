import {put, call, takeEvery} from 'redux-saga/effects';

import {team} from '../stores';
import {getTeamLeagues, getTeamYears} from '../apis';

function* getTeamLeaguesSaga({payload}) {
  try {
    const result = yield call(getTeamLeagues, payload);
    yield put(team.actions.getTeamLeaguesSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(team.actions.getTeamLeaguesFailure({errorText}));
  }
}

function* getTeamYearsSaga({payload}) {
  try {
    const result = yield call(getTeamYears, payload);
    yield put(team.actions.getTeamYearsSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(team.actions.getTeamYearsFailure({errorText}));
  }
}

export default function* teamSaga() {
  yield takeEvery(team.actions.getTeamLeagues, getTeamLeaguesSaga);
  yield takeEvery(team.actions.getTeamYears, getTeamYearsSaga);
}
