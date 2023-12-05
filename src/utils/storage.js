import AsyncStorage from '@react-native-async-storage/async-storage';

import {Constants} from 'globals';

export const getStorageItem = async key => {
  try {
    return JSON.parse(await AsyncStorage.getItem(key));
  } catch (error) {
    console.log('Error : ', error);
  }
  return null;
};

export const setStorageItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('Error : ', error);
    return;
  }
};

export const removeStorageItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error : ', error);
  }
};

export const getOnboarding = async () => {
  try {
    return await AsyncStorage.getItem(Constants.showedOnboarding);
  } catch (error) {
    console.log('Error : ', error);
  }
  return null;
};

export const saveOnboarding = async () => {
  try {
    await AsyncStorage.setItem(Constants.showedOnboarding, 'true');
  } catch (error) {
    console.log('Error : ', error);
  }
};

export const getUserInfo = async () => {
  try {
    const userInfo = await AsyncStorage.getItem(Constants.userInfo);
    return JSON.parse(userInfo);
  } catch (error) {
    console.log('Error : ', error);
  }
  return {};
};

export const saveUserInfo = async userInfo => {
  try {
    await AsyncStorage.setItem(Constants.userInfo, JSON.stringify(userInfo));
    await AsyncStorage.setItem(Constants.lastLoggedInUserEmail, JSON.stringify(userInfo?.email || ''));
  } catch (error) {
    console.log('Error : ', error);
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.multiRemove([
      Constants.userInfo,
      Constants.cardUploadInfo,
      Constants.showedPushNotificationSplash,
      Constants.dismissedOnboardingWidget,
    ]);
  } catch(error) {
    console.log('Error : ', error);
  }
};
