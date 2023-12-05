import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {CardCondition} from 'components';

const CardFlags = props => {
  const {style} = props;

  const card = useFragment(graphql`
    fragment CardFlags_card on Card {
      ...on SportCard {
        serialNumber
        sportCardFlags: flags
      }
      ...on GameCard {
        gameCardFlags: flags
      }
    }`,
    props.card
  );

  const styles = useStyle();

  const flags = card?.sportCardFlags || card?.gameCardFlags;
  const serialNumber = card?.serialNumber || '';

  if (!flags || !flags?.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {flags.map((flag) => (
        <CardCondition
          key={flag}
          style={styles.itemContainer}
          condition={flag?.replace(/_/g, ' ')}
          serialNumber={serialNumber}
        />
      ))}
    </View>
  );
};

CardFlags.defaultProps = {};

CardFlags.propTypes = {};

export default CardFlags;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    itemContainer: {
      marginRight: 6,
    },
  });
