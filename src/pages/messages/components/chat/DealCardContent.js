import React, {useMemo} from 'react';
import {Text, View} from 'react-native';

import {Image} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {getNumberAndPlayer} from 'utils';

const DealCardContent = ({
  cards,
  numOfCards,
}) => {
  const styles = useStyle();

  const cardNames = useMemo(() => {
    const namesArray = cards.map(item => {
      const name = getNumberAndPlayer(
        item?.card?.number,
        item?.card?.playerName,
        item?.card?.name,
        undefined,
        undefined,
      );
      return name;
    });

    return namesArray.join(', ');
  }, [cards]);

  const cardsLength = numOfCards || cards.length;

  if (cardsLength === 0) {
    return null;
  }

  const {frontImageUrl} = cards[0].card || {};

  return (
    <View style={styles.container}>
      <Image source={frontImageUrl} style={styles.imageCard} />
      <View style={styles.userInfoContainer}>
        <Text style={styles.textName} numberOfLines={2}>{cardNames}</Text>
        <Text style={styles.textCount}>
          {`${cardsLength} Card${cardsLength > 1 ? 's' : ''}`}
        </Text>
      </View>
    </View>
  );
}

export default DealCardContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 14,
  },
  imageCard: {
    width: 46,
    height: 58,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  textName: {
    fontWeight: Fonts.extraBold,
    fontFamily: Fonts.nunitoExtraBold,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
  },
  textCount: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
}));
