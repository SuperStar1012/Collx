import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

const loadingIcon = require('assets/lottie/loading_blue.json');

const LoadingIndicator = ({
  style,
  lottieStyle,
  isLoading,
  isModalMode,
}) => {
  const lottieViewRef = useRef(null);

  if (!isLoading) {
    return null;
  }

  const handleLayout = () => {
    if (isModalMode) {
      lottieViewRef.current?.play();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <LottieView
        ref={lottieViewRef}
        style={[styles.iconLoading, lottieStyle]}
        source={loadingIcon}
        autoPlay
        onLayout={handleLayout}
      />
    </View>
  );
};

LoadingIndicator.defaultProps = {
  isLoading: false,
};

LoadingIndicator.propTypes = {
  isLoading: PropTypes.bool,
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#00000020',
    zIndex: 999,
    elevation: 10,
  },
  iconLoading: {
    width: 100,
    height: 100,
  },
});
