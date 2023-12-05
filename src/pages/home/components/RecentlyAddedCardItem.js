import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useActions} from 'actions';

import {Image} from 'components';

import {Constants, Styles} from 'globals';
import {wp} from 'utils';

const RecentlyAddedCardItem = (props) => {
  const styles = useStyle();
  const actions = useActions();

  const tradingCard = useFragment(graphql`
    fragment RecentlyAddedCardItem_tradingCard on TradingCard {
      id
      frontImageUrl
    }`,
    props.tradingCard
  );

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      activeOpacity={0.9}
      onPress={() => actions.pushTradingCardDetail(tradingCard.id)}>
      <Image
        style={styles.imageCover}
        source={tradingCard.frontImageUrl || Constants.defaultCardImage}
      />
    </TouchableOpacity>
  );
};

export default RecentlyAddedCardItem;

const useStyle = () =>
  StyleSheet.create({
    container: {
      width: Math.round((Styles.screenWidth - 80) / 3),
      height: wp(36.5),
      overflow: 'hidden',
      marginHorizontal: 6,
    },
    imageCover: {
      width: '100%',
      height: '100%',
    },
  });
