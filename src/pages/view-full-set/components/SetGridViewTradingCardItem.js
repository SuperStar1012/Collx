import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Image} from 'components';

import {Constants, Styles} from 'globals';
import {wp} from 'utils';

const SetGridViewTradingCardItem = ({
  style,
  tradingCard,
  onPress,
}) => {
  const queryTradingCard = useFragment(graphql`
    fragment SetGridViewTradingCardItem_tradingCard on TradingCard {
      id
      frontImageUrl
    }`,
    tradingCard
  );

  const handleSelect = () => {
    if (onPress) {
      onPress(queryTradingCard);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}>
      <Image
        style={styles.imageCover}
        source={queryTradingCard.frontImageUrl || Constants.defaultCardImage}
      />
    </TouchableOpacity>
  );
};

SetGridViewTradingCardItem.defaultProps = {
  onPress: () => {},
};

SetGridViewTradingCardItem.propTypes = {
  onPress: PropTypes.func,
};

export default SetGridViewTradingCardItem;

const styles = StyleSheet.create({
  container: {
    width: Styles.gridCardWidth,
    margin: 3,
  },
  imageCover: {
    width: '100%',
    height: wp(22.6),
  },
});
