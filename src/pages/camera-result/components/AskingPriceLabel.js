import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {CardPrice} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';

const priceTagIcon = require('assets/icons/tag_fill.png');

const AskingPriceLabel = props => {
  const {
    style,
    priceStyle,
    iconStyle,
    stateStyle,
    disabled,
    onEditAskingPrice,
  } = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const tradingCard = useFragment(graphql`
    fragment AskingPriceLabel_tradingCard on TradingCard {
      state
      listing {
        askingPrice {
          formattedAmount
        }
      }
    }`,
    props.tradingCard
  );

  const handleAskPrice = () => {
    if (onEditAskingPrice) {
      onEditAskingPrice();
    }
  };

  const renderPrice = () => {
    if (!tradingCard?.listing?.askingPrice) {
      return <Text style={styles.textTapToEnter}>Tap to enter</Text>;
    }

    return (
      <CardPrice
        priceStyle={[styles.textPrice, priceStyle]}
        iconStyle={[styles.iconPriceTag, iconStyle]}
        price={tradingCard?.listing?.askingPrice?.formattedAmount}
        color={colors.primary}
        icon={priceTagIcon}
        isShowIcon={true}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabledButton, style]}
      activeOpacity={0.9}
      disabled={disabled}
      onPress={handleAskPrice}
    >
      {renderPrice()}
      <Text style={[styles.textPriceState, stateStyle]}>
        Asking Price
      </Text>
    </TouchableOpacity>
  );
};

AskingPriceLabel.defaultProps = {
  disabled: false,
  onEditAskingPrice: () => {},
};

AskingPriceLabel.propTypes = {
  disabled: PropTypes.bool,
  onEditAskingPrice: PropTypes.func,
};

export default AskingPriceLabel;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '48%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderRadius: 4,
  },
  textPriceState: {
    fontWeight: Fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: -0.004,
    color: colors.lightGrayText,
    marginTop: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  textTapToEnter: {
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
  iconPriceTag: {
    width: 16,
    height: 16,
  },
  textPrice: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
}));
