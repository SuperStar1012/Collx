import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Image} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {getNumberAndPlayer} from 'utils';

const DealTradingCards = ({
  deal
}) => {
  const styles = useStyle();

  const queryDeal = useFragment(graphql`
    fragment DealTradingCards_deal on Deal {
      tradingCards {
        id
        frontImageUrl
        card {
          name
          number
          ...on SportCard {
            player {
              name
            }
          }
        }
      }
    }`,
    deal
  );

  if (!queryDeal) {
    return null;
  }

  const cardNames = useMemo(() => {
    const namesArray = queryDeal.tradingCards.map(tradingCard => {
      const name = getNumberAndPlayer(
        tradingCard.card?.number,
        tradingCard.card?.player?.name,
        tradingCard.card?.name,
        undefined,
        undefined,
      );
      return tradingCard.card?.number ? `${name}` : name;
    });

    return namesArray.join(', ');
  }, [queryDeal.tradingCards]);


  const cardsLength = queryDeal.tradingCards.length;
  const firstCardImage = queryDeal.tradingCards[0].frontImageUrl;

  return (
    <View style={styles.container}>
      <Image source={firstCardImage} style={styles.imageCard} />
      <View style={styles.userInfoContainer}>
        <Text style={styles.textName} numberOfLines={2}>{cardNames}</Text>
        <Text style={styles.textCount}>
          {`${cardsLength} Card${cardsLength > 1 ? 's' : ''}`}
        </Text>
      </View>
    </View>
  );
};

export default DealTradingCards;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageCard: {
    width: 53,
    height: 67,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  textName: {
    fontWeight: Fonts.extraBold,
    fontFamily: Fonts.nunitoExtraBold,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  textCount: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
}));
