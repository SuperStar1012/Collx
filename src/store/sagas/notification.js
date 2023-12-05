import {put, takeEvery} from 'redux-saga/effects';

import {notification} from '../stores';

function* setPushNotificationAskSaga({payload}) {
  try {
    yield put(notification.actions.setPushNotificationAskSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
  }
}

function* setPermissionCheckAllowSaga({payload}) {
  try {
    yield put(notification.actions.setPermissionCheckAllowSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
  }
}

export default function* notificationSaga() {
  yield takeEvery(
    notification.actions.setPushNotificationAsk,
    setPushNotificationAskSaga,
  );
  yield takeEvery(
    notification.actions.setPermissionCheckAllow,
    setPermissionCheckAllowSaga,
  );
}
