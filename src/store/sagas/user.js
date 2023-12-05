import {put, call, takeEvery, select} from 'redux-saga/effects';

import {user, friend} from '../stores';
import {
  setAxiosToken,
  resetAxios,
  signIn,
  signUp,
  lookUp,
  resetPassword,
  createLink,
  updateUser,
  uploadAvatar,
  setFollow,
  setUnfollow,
  setBlock,
  setUnblock,
  getUsers,
  deleteUser,
} from '../apis';
import {saveUserInfo, signOut} from 'utils';
import {Constants} from 'globals';
import {setStorageItem} from 'utils';
import {
  removeGetStreamDevice,
  singularUnsetCustomUserId,
  customerClearIdentify,
  revenuecatLogout,
} from 'services';

function* signInSaga({payload}) {
  try {
    const result = yield call(signIn, payload);

    if (result && result.token) {
      setAxiosToken(result.token);
    }

    const userInfo = {
      ...result,
      password: payload.password,
    };

    saveUserInfo(userInfo);
    yield put(user.actions.signInSuccess(userInfo));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.signInFailure({errorText}));
  }
}

function* signUpSaga({payload}) {
  try {
    const result = yield call(signUp, payload);

    if (result && result.token) {
      setAxiosToken(result.token);
    }

    const userInfo = {
      ...result,
      password: payload.password,
    };

    saveUserInfo(userInfo);

    yield put(
      user.actions.signUpSuccess({
        userRequest: payload,
        userResult: userInfo,
      }),
    );
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.signUpFailure({errorText}));
  }
}

function* signUpCompleteSaga() {
  try {
    yield put(user.actions.signUpCompleteSuccess());
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.signUpCompleteFailure({errorText}));
  }
}

function* resetSignUpSaga() {
  try {
    yield put(user.actions.resetSignUpSuccess());
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.resetSignUpFailure({errorText}));
  }
}

function* updateUserSaga({payload}) {
  try {
    const userState = yield select(state => state.user);

    const result = yield call(updateUser, payload);
    const userInfo = {
      ...userState.user,
      ...result,
    };
    saveUserInfo(userInfo);
    yield put(user.actions.updateUserSuccess(userInfo));
  } catch (error) {
    console.log('Error : ', error.response);
    // const errorText = error.message;
    let errorText = '';
    if (error.response?.data?.errors?.length > 0) {
      errorText = error.response?.data?.errors[0];
    }
    yield put(user.actions.updateUserFailure({errorText}));
  }
}

function* lookUpSaga({payload}) {
  try {
    const result = yield call(lookUp, payload);
    yield put(user.actions.lookUpSuccess(result));
  } catch (error) {
    console.log('Error : ', error);

    // const errorText = error.message;
    // yield put(user.actions.lookUpFailure({errorText}));

    const result = {
      anonymous: false,
      exists: false,
    };
    yield put(user.actions.lookUpSuccess(result));
  }
}

function* lookUpSocialSaga({payload}) {
  try {
    const result = yield call(lookUp, payload);
    yield put(user.actions.lookUpSocialSuccess(result));
  } catch (error) {
    console.log('Error : ', error);

    const result = {
      anonymous: false,
      exists: false,
    };
    yield put(user.actions.lookUpSocialSuccess(result));
  }
}

function* createLinkSaga({payload}) {
  try {
    const result = yield call(createLink, payload);
    yield put(user.actions.createLinkSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.createLinkFailure({errorText}));
  }
}

function* resetPasswordSaga({payload}) {
  try {
    const result = yield call(resetPassword, payload);
    yield put(user.actions.resetPasswordSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.resetPasswordFailure({errorText}));
  }
}

function* setPushTokenSaga({payload}) {
  try {
    yield put(user.actions.setPushTokenSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(user.actions.setPushTokenFailure());
  }
}

function* uploadAvatarSaga({payload}) {
  try {
    const userState = yield select(state => state.user);

    const result = yield call(uploadAvatar, payload);

    const userInfo = {
      ...userState.user,
      avatarImageUrl: result.avatarImageUrl,
    };

    saveUserInfo(userInfo);
    yield put(user.actions.uploadAvatarSuccess(userInfo));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.uploadAvatarFailure({errorText}));
  }
}

function* updatePasswordSaga({payload}) {
  try {
    const userState = yield select(state => state.user);

    const data = {
      password: payload,
    };

    const response = yield call(updateUser, data);

    const userInfo = {
      ...userState.user,
      ...response,
      password: payload,
    };
    saveUserInfo(userInfo);

    yield put(user.actions.updatePasswordSuccess(userInfo));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.updatePasswordFailure({errorText}));
  }
}

function* setAppearanceModeSaga({payload}) {
  try {
    setStorageItem(Constants.darkAppearanceMode, payload);
    yield put(user.actions.setAppearanceModeSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(user.actions.setAppearanceModeFailure());
  }
}

function* setCameraSoundEffectSaga({payload}) {
  try {
    setStorageItem(Constants.cameraSoundEffect, payload);
    yield put(user.actions.setCameraSoundEffectSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    yield put(user.actions.setCameraSoundEffectFailure());
  }
}

function* deleteUserSaga({payload}) {
  try {
    const response = yield call(deleteUser, payload);
    yield put(user.actions.deleteUserSuccess(response));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.deleteUserFailure({errorText}));
  }
}

function* setFollowSaga({payload}) {
  try {
    const userState = yield select(state => state.user);

    const {userId, enabled} = payload;
    let followingCount = userState.user.followingCount;

    if (enabled) {
      yield call(setFollow, userId);
      followingCount++;
    } else {
      yield call(setUnfollow, userId);
      followingCount--;
    }

    const userInfo = {
      ...userState.user,
      followingCount: followingCount >= 0 ? followingCount : 0,
    };
    saveUserInfo(userInfo);

    yield put(user.actions.setFollowSuccess(payload));
    yield put(friend.actions.setFollowSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.setFollowFailure({errorText}));
  }
}

function* setBlockSaga({payload}) {
  try {
    const {userId, enabled} = payload;
    if (enabled) {
      yield call(setBlock, userId);
    } else {
      yield call(setUnblock, userId);
    }

    yield put(user.actions.setBlockSuccess(payload));
    yield put(friend.actions.setBlockSuccess(payload));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.setFollowFailure({errorText}));
  }
}

function* getUsersSaga({payload}) {
  try {
    const result = yield call(getUsers, payload);
    yield put(user.actions.getUsersSuccess(result));
  } catch (error) {
    console.log('Error : ', error);
    const errorText = error.message;
    yield put(user.actions.getUsersFailure({errorText}));
  }
}

function* signOutSaga() {
  try {
    const userState = yield select(state => state.user);
    const userId = userState.user.id;
    const pushToken = userState.pushToken;

    // Remove Get Stream device
    if (userId && pushToken) {
      yield call(removeGetStreamDevice, userId, pushToken);
    }

    // Logout RevenueCat
    revenuecatLogout();

    // Clear CustomerIO
    yield call(customerClearIdentify);

    // Unset Singular
    yield call(singularUnsetCustomUserId);

    // Reset authentication token for axios
    resetAxios();

    // Remove local storage
    signOut();

    yield put(user.actions.signOutSuccess());
  } catch (error) {
    console.log('Error : ', error);
    yield put(user.actions.signOutSuccess());
  }
}

export default function* userSaga() {
  yield takeEvery(user.actions.signIn, signInSaga);
  yield takeEvery(user.actions.signUp, signUpSaga);
  yield takeEvery(user.actions.signUpComplete, signUpCompleteSaga);
  yield takeEvery(user.actions.resetSignUp, resetSignUpSaga);
  yield takeEvery(user.actions.updateUser, updateUserSaga);
  yield takeEvery(user.actions.lookUp, lookUpSaga);
  yield takeEvery(user.actions.lookUpSocial, lookUpSocialSaga);
  yield takeEvery(user.actions.resetPassword, resetPasswordSaga);
  yield takeEvery(user.actions.createLink, createLinkSaga);
  yield takeEvery(user.actions.signOut, signOutSaga);
  yield takeEvery(user.actions.uploadAvatar, uploadAvatarSaga);
  yield takeEvery(user.actions.updatePassword, updatePasswordSaga);
  yield takeEvery(user.actions.setPushToken, setPushTokenSaga);
  yield takeEvery(user.actions.setAppearanceMode, setAppearanceModeSaga);
  yield takeEvery(user.actions.setCameraSoundEffect, setCameraSoundEffectSaga);
  yield takeEvery(user.actions.deleteUser, deleteUserSaga);

  yield takeEvery(user.actions.setFollow, setFollowSaga);
  yield takeEvery(user.actions.setBlock, setBlockSaga);
  yield takeEvery(user.actions.getUsers, getUsersSaga);
}
