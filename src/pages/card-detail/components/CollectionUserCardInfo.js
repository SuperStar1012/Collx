import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';

import {createUseStyle} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');
const squareStackFillIcon = require('assets/icons/square_stack_fill.png');

const CollectionUserCardInfo = ({
  style,
  card,
  onViewUserCard,
  onViewAllUserCards,
}) => {

  const styles = useStyle();

  const cardData = useFragment(graphql`
    fragment CollectionUserCardInfo_card on Card {
      viewer {
        isInMyCollection
        tradingCards {
          id
        }
      }
    }`,
    card
  );

  const {isInMyCollection, tradingCards} = cardData.viewer || {};

  if (!isInMyCollection || !tradingCards?.length) {
    return null;
  }

  const handleView = () => {
    const counts = cardData.viewer?.tradingCards?.length;

    if (counts > 1) {
      if (onViewAllUserCards) {
        onViewAllUserCards();
      }
    } else {
      if (onViewUserCard) {
        onViewUserCard(cardData.viewer?.tradingCards[0].id);
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconStack} source={squareStackFillIcon} />
      <Text style={styles.textInfo}>
        This card is in your collection.
      </Text>
      <Button
        style={styles.button}
        label="View"
        labelStyle={styles.textView}
        icon={chevronIcon}
        iconStyle={styles.iconChevron}
        scale={Button.scaleSize.One}
        onPress={handleView}
      />
    </View>
  );
};

export default CollectionUserCardInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.secondaryCardBackground,
  },
  iconStack: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  textInfo: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    marginLeft: 2,
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconChevron: {
    width: 18,
    height: 18,
    tintColor: colors.primary,
  },
  textView: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));
