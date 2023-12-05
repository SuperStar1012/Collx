import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import {Constants} from 'globals';

const photoLibraryPermission = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
});

export const checkPhotoLibraryPermission = async () => {
  if (Platform.OS === 'android' && Constants.systemVersion >= 13) {
    return true;
  }

  let result = RESULTS.UNAVAILABLE;

  try {
    result = await check(photoLibraryPermission);

    if (result === RESULTS.DENIED) {
      result = await request(photoLibraryPermission);
    }
  } catch (error) {
    console.log(error);
  }

  return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
};

export const requestPhotoLibraryPermission = async () => {
  let result = RESULTS.UNAVAILABLE;

  try {
    result = await request(photoLibraryPermission);
  } catch (error) {
    console.log(error);
  }

  return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
};
