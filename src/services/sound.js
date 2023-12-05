import {Platform} from 'react-native';
import Sound from 'react-native-sound';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

Sound.setCategory('Ambient');

export const soundTypes = {
  success: 'success',
  fail: 'fail',
  greater: 'greater',
};

const soundsAndHaptics = {
  [soundTypes.success]: {
    sound: 'recognition_success.wav',
    haptic: 'impactMedium'
  },
  [soundTypes.fail]: {
    sound: 'recognition_fail.wav',
    haptic: 'notificationError',
  },
  [soundTypes.greater]: {
    sound: 'recognition_greater.wav',
    haptic: 'notificationSuccess',
  },
};

export const playSound = soundType => {
  if (!soundsAndHaptics[soundType]) {
    return;
  }

  const soundInstance = new Sound(
    soundsAndHaptics[soundType].sound,
    Platform.select({
      ios: Sound.MAIN_BUNDLE,
      android: Sound.MAIN_BUNDLE,
    }),
    error => {
      if (error) {
        console.log(error);
        return;
      }

      if (!soundInstance) {
        return;
      }

      soundInstance.play(() => {
        soundInstance.release();
      });
    }
  );

  ReactNativeHapticFeedback.trigger(
    soundsAndHaptics[soundType].haptic, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    },
  );
};
