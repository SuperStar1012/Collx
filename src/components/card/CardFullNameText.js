import React from 'react';
import {Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';

const CardFullNameText = (props) => {
  const {style} = props;

  const styles = useStyle();

  const card = useFragment(graphql`
    fragment CardFullNameText_card on Card {
      number
      name
      ...on SportCard {
        player {
          name
        }
        team {
          name
        }
      }
    }`,
    props.card
  );

  if (!card) {
    return null;
  }

  return (
    <Text style={[styles.textName, style]} numberOfLines={1}>
      {card.number && (
        Number.isInteger(Number(card.number))
          ? `#${card.number} `
          : `${card.number} `
        )
      }
      {card.player?.name || card.name}
      {card.team?.name && `, ${card.team.name}`}
    </Text>
  );
};

export default CardFullNameText;

const useStyle = createUseStyle(({colors}) => ({
  textName: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
}));
