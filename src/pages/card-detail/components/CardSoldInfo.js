import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const dollarCircleIcon = require('assets/icons/dollar_circle.png');
const exclamationIcon = require('assets/icons/exclamation_circle.png');

const CardSoldInfo = ({
  style,
  tradingCard,
}) => {

  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment CardSoldInfo_tradingCard on TradingCard {
      state
      sale {
        soldFor {
          amount
          formattedAmount
        }
      }
      viewer {
        myOrderWithThisCard {
          buyer {
            name
          }
        }
      }
    }`,
    tradingCard
  );

  if (tradingCardData.state !== SchemaTypes.tradingCardState.SOLD) {
    return null;
  }

  const {amount, formattedAmount} = tradingCardData.sale?.soldFor || {};
  const buyerName = tradingCardData.viewer?.myOrderWithThisCard?.buyer?.name || '';

  const renderSoldWithPriceAndBuyerName = () => (
    <>
      <Image style={styles.icon} source={dollarCircleIcon} />
      <Text style={[styles.textInfo, styles.textPrice]}>
        This card has been sold for
        <Text style={styles.textInfoBold}>
          {` ${formattedAmount} `}
        </Text>
        to
        <Text style={styles.textInfoBold}>
          {` ${buyerName}`}
        </Text>
      </Text>
    </>
  );

  const renderSoldWithPrice = () => (
    <>
      <Image style={styles.icon} source={dollarCircleIcon} />
      <Text style={[styles.textInfo, styles.textPrice]}>
        This card sold for
        <Text style={styles.textInfoBold}>
          {` ${formattedAmount}`}
        </Text>
      </Text>
    </>
  );

  const renderSoldWithBuyerName = () => (
    <>
      <Image style={styles.icon} source={exclamationIcon} />
      <Text style={[styles.textInfo, styles.textNoPrice]}>
        This card has been sold to
        <Text style={styles.textInfoBold}>
          {` ${buyerName}`}
        </Text>
      </Text>
    </>
  );

  const renderSoldWithoutPrice = () => (
    <>
      <Image style={styles.icon} source={exclamationIcon} />
      <Text style={[styles.textInfo, styles.textNoPrice]}>
        This card has been sold
      </Text>
    </>
  );

  const renderContent = () => {
    if (Number(amount)) {
      if (buyerName === '') {
        return renderSoldWithPrice();
      }
      return renderSoldWithPriceAndBuyerName()
    } else {
      if (buyerName === '') {
        return renderSoldWithBuyerName()
      }
      return renderSoldWithoutPrice()
    }
  };

  return (
    <View style={[styles.container, style]}>
      {renderContent()}
    </View>
  );
};

CardSoldInfo.defaultProps = {};

CardSoldInfo.propTypes = {
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CardSoldInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.secondaryCardBackground,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  textInfo: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    marginLeft: 4,
  },
  textPrice: {
    color: colors.darkGrayText,
  },
  textNoPrice: {
    color: colors.primary,
  },
  textInfoBold: {
    fontWeight: Fonts.semiBold,
  },
}));
