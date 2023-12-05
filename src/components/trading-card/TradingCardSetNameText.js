import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text} from 'react-native';

import {createUseStyle} from 'theme';

const TradingCardSetNameText = ({
  style,
  tradingCard,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardSetNameText_tradingCard on TradingCard {
      card {
        set {
          name
        }
      }
    }`,
    tradingCard
  );

  return (
    <Text style={[styles.textSet, style]} numberOfLines={1}>
      {tradingCardData.card?.set?.name || 'Unknown Set'}
    </Text>
  );
};

export default TradingCardSetNameText;

const useStyle = createUseStyle(({colors}) => ({
  textSet: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
}));
