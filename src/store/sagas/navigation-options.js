import {put, takeEvery} from 'redux-saga/effects';

import {navigationOptions} from '../stores';

function* setNavigationOptionsSaga({payload}) {
  yield put(
    navigationOptions.actions.setNavigationOptionsSuccess(payload),
  );
}

export default function* navigationOptionsSaga() {
  yield takeEvery(navigationOptions.actions.setNavigationOptions, setNavigationOptionsSaga);
}
