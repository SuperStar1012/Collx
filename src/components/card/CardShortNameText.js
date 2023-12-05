import React from 'react';
import {Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

const CardShortNameText = ({
  style,
  card,
}) => {
  const cardData = useFragment(graphql`
    fragment CardShortNameText_card on Card {
      number
      ...on SportCard {
        player {
          name
        }
      }
    }`,
    card,
  );

  return (
    <Text style={style} numberOfLines={1}>
      {cardData.number && (
        Number.isInteger(Number(cardData.number))
          ? `#${cardData.number} `
          : `${cardData.number} `
        )
      }
      {cardData.player?.name || cardData.name}
    </Text>
  );
};

export default CardShortNameText;
