import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text, View} from 'react-native';

import {Constants} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';
import {getCardMarketPrice} from 'utils';

const CardMarketValue = (props) => {

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const card = useFragment(graphql`
    fragment CardMarketValue_card on Card @argumentDefinitions(
      assumedCondition: {type: "String"}
    ) {
      marketValue(assumingCondition: $assumedCondition) {
        source
        price {
          formattedAmount
        }
      }
    }`,
    props.card
  );

  const priceInfo = getCardMarketPrice(card, colors);

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.priceContainer}>
        <Text style={[styles.textPrice, {color: priceInfo.color}, props.priceStyle]}>{priceInfo.price || Constants.cardPriceNone}</Text>
      </View>
      <Text style={[styles.textPriceState, props.stateStyle]}>{priceInfo.label}</Text>
    </View>
  );
};

export default CardMarketValue;

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
