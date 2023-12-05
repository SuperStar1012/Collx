import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Constants} from 'globals';
import {createUseStyle, Fonts} from 'theme';

const CardPrice = ({
  style,
  priceStyle,
  iconStyle,
  price,
  color,
  icon,
  isShowIcon,
}) => {
  const styles = useStyle();

  const renderIcon = () => {
    if (!icon || !isShowIcon || price === Constants.cardPriceNone) {
      return null;
    }

    return (
      <Image
        style={[styles.icon, {tintColor: color}, iconStyle]}
        source={icon}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderIcon()}
      <Text style={[styles.textPrice, {color}, priceStyle]}>{price}</Text>
    </View>
  );
};

CardPrice.defaultProps = {
  isShowIcon: false,
};

CardPrice.propTypes = {
  price: PropTypes.string,
  icon: PropTypes.number,
  color: PropTypes.string,
  isShowIcon: PropTypes.bool,
};

export default CardPrice;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrice: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  icon: {
    width: 28,
    height: 28,
  },
}));
