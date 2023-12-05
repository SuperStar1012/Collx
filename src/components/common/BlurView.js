import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';

import {Colors} from 'theme';

const CustomBlurView = props => {
  const blurType = useColorScheme();

  const {style} = props;
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        blurType={blurType}
        blurAmount={27}
        {...props}
        style={[styles.container, style]}
        overlayColor="transparent"
      />
    );
  }

  return <View style={[styles.container, style]} />;
};

CustomBlurView.defaultProps = {};

CustomBlurView.propTypes = {};

export default CustomBlurView;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Platform.select({
      ios: Colors.blackAlpha6,
      android: Colors.black, // blackAlpha8
    }),
  },
});
