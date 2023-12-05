import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

export const checkCameraPermission = async () => {
  let result = RESULTS.UNAVAILABLE;

  try {
    result = await check(cameraPermission);

    if (result === RESULTS.DENIED) {
      result = await request(cameraPermission);
    }
  } catch (error) {
    console.log(error);
  }

  return result === RESULTS.GRANTED;
};

export const requestCameraPermission = async () => {
  let result = RESULTS.UNAVAILABLE;

  try {
    result = await request(cameraPermission);
  } catch (error) {
    console.log(error);
  }

  return result === RESULTS.GRANTED;
};
