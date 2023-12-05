import React, {useMemo} from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {CardPrice} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {getCardFormattedPrice} from 'utils';

const CardPriceLabel = ({
  style,
  priceStyle,
  iconStyle,
  stateStyle,
  canonicalCard,
  tradingCard,
  isShowIcon,
  conditionName,
}) => {

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  let canonicalCardData = null;
  let tradingCardData = null;

  if (canonicalCard) {
    canonicalCardData = useFragment(graphql`
      fragment CardPriceLabel_card on Card {
        marketValue{
          price {
            formattedAmount
          }
          source
        }
        allMarketValues {
          condition {
            name
          }
          marketValue{
            price {
              formattedAmount
            }
            source
          }
        }
      }`,
      canonicalCard
    );
  } else if (tradingCard) {
    tradingCardData = useFragment(graphql`
      fragment CardPriceLabel_tradingCard on TradingCard {
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
  }

  const priceInfo = useMemo(() => {
    if (tradingCardData) {
      return getCardFormattedPrice(tradingCardData, colors)
    } else if (canonicalCardData) {
      let marketValue;
      if (conditionName) {
        marketValue = canonicalCardData.allMarketValues.find(item => item.condition.name === conditionName);
      } else {
        marketValue = {marketValue: canonicalCardData.marketValue};
      }

      return getCardFormattedPrice(marketValue || {}, colors);
    }

    return {};
  }, [conditionName, canonicalCardData, tradingCardData, colors]) ;

  return (
    <View style={[styles.container, style]}>
      {priceInfo.price ? (
        <CardPrice
          priceStyle={priceStyle}
          iconStyle={iconStyle}
          price={priceInfo.price}
          color={priceInfo.color}
          icon={priceInfo.icon}
          isShowIcon={isShowIcon}
        />
      ) : null}
      <Text style={[styles.textPriceState, stateStyle]}>{priceInfo.label}</Text>
    </View>
  );
};

CardPriceLabel.defaultProps = {
  isShowIcon: false,
};

CardPriceLabel.propTypes = {
  isShowIcon: PropTypes.bool,
};

export default CardPriceLabel;

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
