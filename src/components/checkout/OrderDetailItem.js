import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useFragment, graphql} from 'react-relay';

import {Image} from 'components';
import {
  TradingCardConditionAndFlags,
  TradingCardSetNameText,
  TradingCardNumberAndPlayerText,
} from '../trading-card';

import {Constants} from 'globals';
import {createUseStyle} from 'theme';

const OrderDetailItem = (props) => {
  const {
    style,
    onSelectCard,
  } = props;

  const styles = useStyle();

  const tradingCard = useFragment(graphql`
    fragment OrderDetailItem_tradingCard on TradingCard {
      id
      frontImageUrl
      ...TradingCardSetNameText_tradingCard
      ...TradingCardNumberAndPlayerText_tradingCard
      ...TradingCardConditionAndFlags_tradingCard
    }`,
    props.tradingCard
  );

  const handleSelect = () => {
    if (onSelectCard) {
      onSelectCard(tradingCard.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}
    >
      <Image
        style={styles.imageCard}
        source={tradingCard.frontImageUrl || Constants.defaultCardImage}
      />
      <View style={styles.mainContentContainer}>
        <View>
          <TradingCardSetNameText tradingCard={tradingCard} />
          <TradingCardNumberAndPlayerText tradingCard={tradingCard} />
        </View>
        <TradingCardConditionAndFlags tradingCard={tradingCard} />
      </View>
    </TouchableOpacity>
  );
};

export default OrderDetailItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageCard: {
    width: 58,
    height: 80,
    overflow: 'hidden',
  },
  mainContentContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
}));
