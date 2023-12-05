/* eslint-disable no-undef */
import analytics from '@react-native-firebase/analytics';

export const firebaseAnalyticsSetUser = async (user) => {
  const {id} = user;

  if (__DEV__) {
    return;
  }

  try {
    await analytics().setUserId(id);
  } catch (error) {
    console.log(error);
  }
};

export const firebaseAnalyticsLogEvent = async (name, params = {}) => {
  if (__DEV__) {
    return;
  }

  if (!name) {
    return;
  }

  try {
    await analytics().logEvent(name, params);
  } catch (error) {
    console.log(error);
  }
};

export const firebaseAnalyticsLogPurchase = async (params) => {
  if (__DEV__) {
    return;
  }

  if (!params) {
    return;
  }

  try {
    await analytics().logPurchase(params);
  } catch (error) {
    console.log(error);
  }
};
