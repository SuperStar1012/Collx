import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {View} from 'react-native';

import CardSetNameText from './CardSetNameText';
import CardPlayerName from './CardPlayerName';

import {Colors, createUseStyle} from 'theme';

const CardSetAndName = (props) => {
  const {style} = props;

  const styles = useStyle();

  const card = useFragment(graphql`
    fragment CardSetAndName_card on Card {
      ...CardSetNameText_card
      ...CardPlayerName_card
    }`,
    props.card
  );

  return (
    <View style={[styles.container, style]}>
      <CardSetNameText style={styles.textSetName} card={card} />
      <CardPlayerName style={styles.textPlayerName} card={card} />
    </View>
  );
};

export default CardSetAndName;

const useStyle = createUseStyle(() => ({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  textSetName: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.whiteAlpha5,
  },
  textPlayerName: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.softGray,
  },
}));
