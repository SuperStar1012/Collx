import React, {useMemo} from 'react';
import {graphql, useFragment} from 'react-relay';

import {CardPrice} from 'components';

import {getCardFormattedPrice} from 'utils';
import {createUseStyle, useTheme} from 'theme';

const TradingCardListingPrice = ({
  style,
  tradingCard,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardListingPrice_tradingCard on TradingCard {
      state
      sale {
        soldFor {
          amount
          formattedAmount
        }
      }
      listing {
        askingPrice {
          amount
          formattedAmount
        }
      }
      marketValue {
        source
        price {
          amount
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
    <CardPrice
      style={[styles.container, style]}
      priceStyle={styles.textPrice}
      iconStyle={styles.icon}
      price={priceInfo.price}
      color={priceInfo.color}
      icon={priceInfo.icon}
      isShowIcon={true}
    />
  );
};

export default TradingCardListingPrice;

const useStyle = createUseStyle(() => ({
  container: {},
  textPrice: {
    fontSize: 15,
    lineHeight: 18,
    marginLeft: 2,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
}));
