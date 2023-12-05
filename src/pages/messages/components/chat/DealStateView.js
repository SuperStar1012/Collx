import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {DealState} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {getPrice} from 'utils';

const DealStateView = ({
  style,
  deal,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.priceContainer}>
        <Text style={styles.textOffer}>{deal?.offer}</Text>
        <Text style={styles.textPrice}>{getPrice(deal?.price)}</Text>
      </View>
      <DealState
        style={styles.stateContainer}
        textStyle={styles.textState}
        state={deal?.state}
      />
    </View>
  );
};

DealStateView.defaultProps = {};

DealStateView.propTypes = {
  offer: PropTypes.string,
  state: PropTypes.string,
  price: PropTypes.number,
};

export default DealStateView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  priceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textOffer: {
    fontWeight: Fonts.bold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.004,
    color: colors.lightGrayText,
    textTransform: 'uppercase',
  },
  textPrice: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primary,
  },
  stateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textState: {
    fontWeight: Fonts.semiBold,
    fontSize: 10,
    letterSpacing: -0.08,
    marginLeft: 0,
    textTransform: 'uppercase',
  },
}));
