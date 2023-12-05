import {put, takeEvery} from 'redux-saga/effects';

import {emailVerification} from '../stores';

function* setEmailVerifiedActionSaga({payload}) {
  yield put(
    emailVerification.actions.setEmailVerifiedActionSuccess(payload),
  );
}


function* setEmailVerifiedSaga({payload}) {
  try {
    yield put(emailVerification.actions.setEmailVerifiedSuccess(payload));
  } catch (error) {
    yield put(emailVerification.actions.setEmailVerifiedFailure());
  }
}

export default function* emailVerificationSaga() {
  yield takeEvery(emailVerification.actions.setEmailVerifiedAction, setEmailVerifiedActionSaga);
  yield takeEvery(emailVerification.actions.setEmailVerified, setEmailVerifiedSaga);
}
