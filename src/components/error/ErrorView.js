import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button, Image} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const errorIcon = require('assets/icons/more/error_explore.png');

const ErrorView = props => {
  const {
    style,
    title,
    description,
    onTryAgain,
  } = props;

  const styles = useStyle();

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconError} source={errorIcon} />
      <Text style={styles.textTitle}>{title || 'Something went wrong'}</Text>
      <Text style={styles.textDescription}>
        {description || 'An error has occurred. Our team has been notified.'}
      </Text>
      <Button
        style={styles.button}
        label="Try Again"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.Two}
        onPress={handleTryAgain}
      />
    </View>
  );
};

ErrorView.defaultProps = {
  onTryAgain: () => {},
};

ErrorView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onTryAgain: PropTypes.func,
};

export default ErrorView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.primaryBackground,
  },
  iconError: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 12,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: 190,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));
