import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Styles} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {hp} from 'utils';

const DealOnboardingStep = ({
  style,
  imageStyle,
  title,
  description,
  image,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <Image
          style={[styles.imageCover, imageStyle]}
          source={image}
        />
      </View>
      <View style={styles.textsContainer}>
        <Text style={styles.textTitle}>{title}</Text>
        <Text style={styles.textDescription}>{description}</Text>
      </View>
    </View>
  );
};

DealOnboardingStep.defaultProps = {};

DealOnboardingStep.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DealOnboardingStep;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: Styles.windowWidth,
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: hp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCover: {
    height: '100%',
    resizeMode: 'contain',
  },
  textsContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  textDescription: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
}));
