import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const cartIcon = require('assets/icons/cart.png');

const NoResult = props => {
  const {style} = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image source={cartIcon} style={styles.iconCart} />
      <Text style={styles.textNotFoundTitle}>No orders yet</Text>
      <Text style={styles.textNotFoundDescription}>
        There isn’t any order in this status right now.
      </Text>
    </View>
  );
};

NoResult.defaultProps = {};

NoResult.propTypes = {};

export default NoResult;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCart: {
    width: 100,
    height: 86,
    tintColor: colors.grayText,
    marginBottom: 22,
  },
  textNotFoundTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: Fonts.bold,
    letterSpacing: 0.35,
    color: colors.darkGrayText,
    marginBottom: 6,
  },
  textNotFoundDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
}));
