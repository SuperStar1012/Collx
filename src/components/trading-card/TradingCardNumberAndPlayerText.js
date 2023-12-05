import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text} from 'react-native';

import {getNumberAndPlayer} from 'utils';
import {Fonts, createUseStyle} from 'theme';

const TradingCardNumberAndPlayerText = ({
  style,
  tradingCard,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardNumberAndPlayerText_tradingCard on TradingCard {
      card {
        number
        name
        ...on SportCard {
          player {
            name
          }
        }
      }
    }`,
    tradingCard
  );

  return (
    <Text style={[styles.textNumberAndPlayer, style]} numberOfLines={1}>
      {getNumberAndPlayer(
        tradingCardData.card?.number,
        tradingCardData.card?.player?.name,
        tradingCardData.card?.name,
        undefined,
        undefined,
      )}
    </Text>
  );
};

export default TradingCardNumberAndPlayerText;

const useStyle = createUseStyle(({colors}) => ({
  textNumberAndPlayer: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
    marginTop: 4,
  },
}));
