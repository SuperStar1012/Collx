import React from 'react';
import {Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';

const CardPlayerName = (props) => {
  const {style} = props;

  const styles = useStyle();

  const card = useFragment(graphql`
    fragment CardPlayerName_card on Card {
      name
      ...on SportCard {
        player {
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
      {card.player?.name || card.name}
    </Text>
  );
};

export default CardPlayerName;

const useStyle = createUseStyle(({colors}) => ({
  textName: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
}));
