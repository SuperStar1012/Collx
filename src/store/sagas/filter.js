import {put, call, takeEvery} from 'redux-saga/effects';

import {filter} from '../stores';
import {getCardFilters} from '../apis';

function* setSortSaga({payload}) {
  yield put(filter.actions.setSortSuccess(payload));
}

function* setFiltersSaga({payload}) {
  yield put(filter.actions.setFilterSuccess(payload));
}

function* setDrawerOpenModeSaga({payload}) {
  yield put(filter.actions.setDrawerOpenModeSuccess(payload));
}

function* setEnabledPreserveSettingsSaga({payload}) {
  yield put(filter.actions.setEnabledPreserveSettingsSuccess(payload));
}

function* getUserCardFiltersSaga({payload}) {
  try {
    const {userId} = payload;

    const result = yield call(getCardFilters, userId);
    yield put(
      filter.actions.getUserCardFiltersSuccess({userId, cardFilters: result}),
    );
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(filter.actions.getUserCardFiltersFailure({errorText}));
  }
}

export default function* filterSaga() {
  yield takeEvery(filter.actions.setSort, setSortSaga);
  yield takeEvery(filter.actions.setFilter, setFiltersSaga);
  yield takeEvery(filter.actions.setDrawerOpenMode, setDrawerOpenModeSaga);
  yield takeEvery(filter.actions.setEnabledPreserveSettings, setEnabledPreserveSettingsSaga);
  yield takeEvery(filter.actions.getUserCardFilters, getUserCardFiltersSaga);
}
