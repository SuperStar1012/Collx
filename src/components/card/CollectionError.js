import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button} from 'components';

import {Fonts, createUseStyle} from 'theme';

const exclamationIcon = require('assets/icons/exclamation_triangle_fill.png');

const CollectionError = props => {
  const {style, onTryAgain} = props;

  const styles = useStyle();

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconExclamation} source={exclamationIcon} />
      <Text style={styles.textTitle}>Something's not right</Text>
      <Text style={styles.textSubTitle}>
        We're sorry. An error has occurred.
      </Text>
      <Button
        style={styles.tryAgainButton}
        label="Try Again"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleTryAgain}
      />
    </View>
  );
};

CollectionError.defaultProps = {
  onTryAgain: () => {},
};

CollectionError.propTypes = {
  onTryAgain: PropTypes.func,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconExclamation: {
    width: 100,
    height: 100,
    tintColor: colors.lightGrayText,
    resizeMode: 'contain',
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
    marginTop: 24,
  },
  textSubTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 10,
  },
  tryAgainButton: {
    width: 240,
    height: 40,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    marginTop: 24,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    textAlign: 'center',
    color: colors.primary,
  },
}));

export default CollectionError;
