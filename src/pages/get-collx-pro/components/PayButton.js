import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle, useTheme} from 'theme';

const PayButton = ({
  style,
  isActive,
  disabled,
  title,
  subTitle,
  discountPercent,
  onPress,
}) => {

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const moreStyle = isActive ? {
    borderWidth: 3,
    borderColor: colors.primary,
  } : {
    borderWidth: 1,
    borderColor: colors.grayBorder,
  };

  const renderDiscountPercent = () => {
    if (!discountPercent) {
      return null;
    }

    const moreStyle = isActive ? {
      top: 2,
      right: 2,
    } : {
      top: 4,
      right: 4,
    };

    return (
      <View style={[styles.discountPercentContainer, moreStyle]}>
        <Text style={styles.textDiscount}>{`-${discountPercent}%`}</Text>
      </View>
    )
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, moreStyle]}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={handlePress}>
      <Text style={styles.textTitle}>{title}</Text>
      <Text style={styles.textSubTitle}>{subTitle}</Text>
      {renderDiscountPercent()}
    </TouchableOpacity>
  );
};

PayButton.defaultProps = {
  isActive: false,
  onPress: () => {},
};

PayButton.propTypes = {
  isActive: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

export default PayButton;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '44.8%',
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayBorder,
  },
  textTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textSubTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.08,
    color: colors.primaryText,
    marginTop: 4,
  },
  discountPercentContainer: {
    position: 'absolute',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.primary,
  },
  textDiscount: {
    fontWeight: Fonts.bold,
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: -0.08,
    color: colors.white,
  },
}));
