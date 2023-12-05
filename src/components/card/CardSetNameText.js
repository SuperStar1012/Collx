import React from 'react';
import {Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle} from 'theme';

const CardSetNameText = (props) => {
  const {style} = props;

  const styles = useStyle();

  const card = useFragment(graphql`
    fragment CardSetNameText_card on Card {
      set {
        name
      }
    }`,
    props.card
  );

  return (
    <Text style={[styles.textName, style]} numberOfLines={2}>
      {card?.set?.name || 'Unknown Set'}
    </Text>
  );
};

export default CardSetNameText;

const useStyle = createUseStyle(({colors}) => ({
  textName: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
}));
