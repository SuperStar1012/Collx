import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

import {Colors} from 'theme';

const checkmarkIcon = require('assets/icons/checkmark_circle_outline.png');

const ToastProvider = () => {
  const toastConfig = useMemo(() => ({
    checkmark: ({
      text1,
      onPress,
    }) => (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <Image style={styles.iconCheckmark} source={checkmarkIcon} />
        <Text style={styles.textLabel}>{text1}</Text>
      </TouchableOpacity>
    )
  }), []);

  return (
    <Toast
      config={toastConfig}
      position="bottom"
      visibilityTime={3000}
    />
  );
};

export default ToastProvider;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 40,
    borderRadius: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.softDarkGreen,
  },
  iconCheckmark: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
  textLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
    marginLeft: 5,
  },
});
