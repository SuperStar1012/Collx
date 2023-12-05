import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';

const loadingIcon = require('assets/lottie/loading_blue.json');

const FooterIndicator = props => {
  const {isLoading, style} = props;
  if (!isLoading) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <LottieView style={styles.iconLoading} source={loadingIcon} autoPlay />
    </View>
  );
};

FooterIndicator.defaultProps = {
  isLoading: false,
};

FooterIndicator.propTypes = {
  isLoading: PropTypes.bool,
};

export default FooterIndicator;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLoading: {
    width: 50,
    height: 50,
  },
});
