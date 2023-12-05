import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const FreeTrialButton = ({
  style,
  disabled,
  onPress,
}) => {
  const styles = useStyle();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={handlePress}>
      <Text style={styles.textTitle}>Get Started for Free</Text>
      <Text style={styles.textSubTitle}>7 day free trial. Cancel anytime</Text>
    </TouchableOpacity>
  );
};

FreeTrialButton.defaultProps = {
  onPress: () => {},
};

FreeTrialButton.propTypes = {
  onPress: PropTypes.func,
};

export default FreeTrialButton;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 12,
  },
  textTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.41,
    color: colors.white,
  },
  textSubTitle: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.white,
  },
}));
