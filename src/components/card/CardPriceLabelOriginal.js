import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import CardPrice from './CardPrice';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {getCardPriceForApi, getPrice} from 'utils';

const CardPriceLabelOriginal = props => {
  const {style, priceStyle, iconStyle, stateStyle, card, isShowIcon} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const priceInfo = getCardPriceForApi(card, colors);

  return (
    <View style={[styles.container, style]}>
      <CardPrice
        priceStyle={priceStyle}
        iconStyle={iconStyle}
        price={getPrice(priceInfo.price)}
        color={priceInfo.color}
        icon={priceInfo.icon}
        isShowIcon={isShowIcon}
      />
      <Text style={[styles.textPriceState, stateStyle]}>{priceInfo.label}</Text>
    </View>
  );
};

CardPriceLabelOriginal.defaultProps = {
  isShowIcon: false,
};

CardPriceLabelOriginal.propTypes = {
  card: PropTypes.object,
  isShowIcon: PropTypes.bool,
};

export default CardPriceLabelOriginal;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: 88,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderRadius: 10,
  },
  textPriceState: {
    fontWeight: Fonts.bold,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: -0.004,
    color: colors.lightGrayText,
    marginTop: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
}));
