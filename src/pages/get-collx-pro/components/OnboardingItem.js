import React from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';

import {createUseStyle, Fonts} from 'theme';
import {wp} from 'utils';

const OnboardingItem = ({
  style,
  subtitle,
  description,
  image,
  imageStyle,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image style={[styles.imageCover, imageStyle]} source={image} />
      <Text style={styles.textSubtitle}>{subtitle}</Text>
      <Text style={styles.textDescription}>{description}</Text>
    </View>
  );
};

OnboardingItem.defaultProps = {};

OnboardingItem.propTypes = {};

export default OnboardingItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(100) - 32,
    paddingHorizontal: 12,
    paddingVertical: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    marginVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.secondaryCardBackground,
    overflow: 'hidden',
  },
  textSubtitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.41,
    color: colors.primaryText,
    textAlign: 'center',
    marginTop: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 6,
  },
  imageCover: {
    resizeMode: 'contain',
  },
}));
