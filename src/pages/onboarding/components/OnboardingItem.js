import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Styles} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const OnboardingItem = props => {
  const {style, imageStyle, title, description, image} = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image style={[styles.imageCover, imageStyle]} source={image} />
      <View
        style={[
          styles.textsContainer,
          {marginBottom: Styles.screenSafeBottomHeight + 134},
        ]}>
        <Text style={styles.textTitle}>{title}</Text>
        <Text style={styles.textDescription}>{description}</Text>
      </View>
    </View>
  );
};

OnboardingItem.defaultProps = {};

OnboardingItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default OnboardingItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    width: Styles.windowWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: Styles.windowWidth,
    height: Math.floor(Styles.windowWidth * 1.03),
  },
  imageCover: {
    // resizeMode: 'contain',
  },
  textsContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.34,
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 16,
  },
  textDescription: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.onboardingFlowText,
    textAlign: 'center',
  },
}));
