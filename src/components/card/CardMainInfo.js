import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {View} from 'react-native';

import CardSetNameText from './CardSetNameText';
import CardFullNameText from './CardFullNameText';

import {createUseStyle} from 'theme';

const CardMainInfo = (props) => {
  const styles = useStyle();

  const card = useFragment(graphql`
    fragment CardMainInfo_card on Card {
      ...CardSetNameText_card
      ...CardFullNameText_card
    }`,
    props.card
  );

  return (
    <View style={[styles.container, props.style]}>
      <CardSetNameText style={styles.textSetName} card={card} />
      <CardFullNameText style={styles.textCardFullName} card={card} />
    </View>
  );
};

export default CardMainInfo;

const useStyle = createUseStyle(() => ({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  textSetName: {
    marginBottom: 6,
  },
  textCardFullName: {},
}));