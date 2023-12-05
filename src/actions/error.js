import {Alert} from 'react-native';

export function createErrorActions() {
  return {
    showErrorAlert: (title, message) => {
      Alert.alert(title, message, [
        {
          text: 'Close',
          style: 'cancel',
        },
      ]);
    }
  };
}