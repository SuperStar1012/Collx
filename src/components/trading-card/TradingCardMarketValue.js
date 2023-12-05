import React, {useMemo} from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text, Image, View} from 'react-native';

import {Constants} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';
import {getCardFormattedPrice} from 'utils';

const TradingCardMarketValue = ({
  style,
  iconStyle,
  priceStyle,
  stateStyle,
  tradingCard,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardMarketValue_tradingCard on TradingCard {
      state
      sale {
        soldFor {
          formattedAmount
        }
      }
      listing {
        askingPrice {
          formattedAmount
        }
      }
      marketValue {
        source
        price {
          formattedAmount
        }
      }
    }`,
    tradingCard
  );

  const priceInfo = useMemo(() => (
    getCardFormattedPrice(tradingCardData, colors)
  ), [tradingCardData, colors]) ;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.priceContainer}>
        {(priceInfo.icon && priceInfo.price !== Constants.cardPriceNone) &&
          <Image
            style={[styles.iconTag, {tintColor: priceInfo.color}, iconStyle]}
            source={priceInfo.icon}
          />
        }
        <Text
          style={[styles.textPrice, {color: priceInfo.color}, priceStyle]}
          numberOfLines={1}
        >
          {priceInfo.price || Constants.cardPriceNone}
        </Text>
      </View>
      <Text style={[styles.textPriceState, stateStyle]}>
        {priceInfo.label}
      </Text>
    </View>
  );
};

export default TradingCardMarketValue;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: 88,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderRadius: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textPrice: {
    flexShrink: 1,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  textPriceState: {
    fontWeight: Fonts.bold,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: -0.004,
    color: colors.lightGrayText,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  iconTag: {
    width: 20,
    height: 20,
  },
}));
