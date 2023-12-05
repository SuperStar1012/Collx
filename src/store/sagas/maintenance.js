import {put, takeEvery} from 'redux-saga/effects';

import {maintenance} from '../stores';

function* setServerMaintenanceSaga({payload}) {
  yield put(
    maintenance.actions.setServerMaintenanceSuccess(payload),
  );
}

export default function* maintenanceSaga() {
  yield takeEvery(maintenance.actions.setServerMaintenance, setServerMaintenanceSaga);
}
