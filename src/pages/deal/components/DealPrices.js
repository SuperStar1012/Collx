import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {SchemaTypes} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {getPrice, getCount, getCardPrice} from 'utils';

const DealPrices = (props) => {
  const {isMeBuyer} = props;

  const styles = useStyle();

  const deal = useFragment(graphql`
    fragment DealPrices_deal on Deal {
      id
      state
      offer {
        value {
          formattedAmount
        }
      }
      tradingCards {
        state
        sale {
          soldFor {
            amount
          }
        }
        listing {
          askingPrice {
            amount
          }
        }
        marketValue {
          source
          price {
            amount
          }
        }
      }
      chargeBreakdown {
        type
        value {
          amount
          formattedAmount
        }
      }
    }`,
    props.deal
  );

  const isBuyerPending = isMeBuyer && deal.state === SchemaTypes.dealState.PENDING;

  const totalCardsPrice = useMemo(() => {
    let totalPrice = 0;
    deal.tradingCards?.forEach(card => {
      const price = getCardPrice(card);
      totalPrice += Number(price || 0);
    });

    return totalPrice.toFixed(2);
  }, [deal.tradingCards]);

  const chargeBreakdown = useMemo(() => {
    const totalItem = deal.chargeBreakdown?.find(item => item.type === SchemaTypes.chargeBreakdownItemType.TOTAL);
    const discountItem = deal.chargeBreakdown?.find(item => item.type === SchemaTypes.chargeBreakdownItemType.DISCOUNT);

    return ({
      total: totalItem?.value || {},
      discount: discountItem?.value || {},
    });
  }, [deal]);

  const renderListedPrice = () => {
    if (isBuyerPending) {
      return null;
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.textGeneral}>
          Listed Price ({getCount(deal.tradingCards.length)} item{deal.tradingCards.length > 1 ? 's' : ''})
        </Text>
        <Text style={styles.textGeneral}>
          {chargeBreakdown.total?.formattedAmount || getPrice(totalCardsPrice)}
        </Text>
      </View>
    );
  };

  const renderDiscount = () => {
    if (isBuyerPending || !deal.offer) {
      return null;
    }

    if (Number(chargeBreakdown.discount.amount || 0) <= 0) {
      return null;
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.textGeneral}>Discount</Text>
        <Text style={styles.textGeneral}>
          {chargeBreakdown.discount.formattedAmount || getPrice(0)}
        </Text>
      </View>
    );
  };

  const renderOfferPrice = () => {
    if (!isBuyerPending && !deal.offer) {
      return null;
    }

    let priceLabel;
    let price;

    if (isBuyerPending) {
      priceLabel = `Subtotal (${deal.tradingCards.length} item${deal.tradingCards.length > 1 ? 's' : ''})`;
      price = chargeBreakdown.total.formattedAmount || getPrice(totalCardsPrice);
    } else {
      priceLabel = 'Offer Price';
      price = deal.offer?.value?.formattedAmount || getPrice(0);
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.textOfferPrice}>{priceLabel}</Text>
        <Text style={styles.textPrice}>{price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderListedPrice()}
      {renderDiscount()}
      {renderOfferPrice()}
    </View>
  );
};

export default DealPrices;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    margin: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  textGeneral: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textOfferPrice: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textPrice: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primary,
  },
}));
