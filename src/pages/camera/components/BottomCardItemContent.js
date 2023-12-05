import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  CardPriceLabel,
  CardSetAndName,
} from 'components';

import {Colors, Fonts} from 'theme';

const BottomCardItemContent = React.memo((props) => {
  const {
    style,
    tradingCardId,
    queryOptions,
  } = props;

  const tradingCardData = useLazyLoadQuery(graphql`
    query BottomCardItemContentTradingCardQuery($tradingCardId: ID!) {
      tradingCard(with: {id: $tradingCardId}) {
        id
        # frontImageUrl
        # backImageUrl(usePlaceholderWhenAbsent: false)
        card {
          ...CardSetAndName_card
        }
        ...CardPriceLabel_tradingCard
      }
    }`,
    {tradingCardId},
    queryOptions,
  );

  if (!tradingCardData) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <CardSetAndName
        style={styles.cardInfoTextsContainer}
        card={tradingCardData.tradingCard?.card}
      />
      <CardPriceLabel
        style={styles.priceContainer}
        priceStyle={styles.textPrice}
        stateStyle={styles.textPriceState}
        tradingCard={tradingCardData.tradingCard}
      />
    </View>
  );
});

BottomCardItemContent.displayName = 'BottomCardItemContent';

BottomCardItemContent.defaultProps = {};

BottomCardItemContent.propTypes = {
  tradingCardId: PropTypes.string,
  queryOptions: PropTypes.object,
};

export default BottomCardItemContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  cardInfoTextsContainer: {
    marginHorizontal: 2,
    marginVertical: 3,
  },
  priceContainer: {
    width: 82,
    height: 60,
    borderRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.whiteAlphaHalf,
  },
  textPrice: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: Colors.softGray,
    marginVertical: 2,
  },
  textPriceState: {
    fontWeight: Fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: -0.008,
    color: Colors.whiteAlpha5,
    marginVertical: 2,
  },
});
