import {Alert} from 'react-native';

export const showErrorAlert = (message) => {
  Alert.alert('CollX', message, [
    {
      text: 'Close',
      style: 'cancel',
    },
  ]);
};

export const showAlert = (title, message) => {
  Alert.alert(title, message, [
    {
      text: 'Close',
      style: 'cancel',
    },
  ]);
};
