import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {View} from 'react-native';

import {
  Image,
  CardSetNameText,
  CardFullNameText,
  CardMarketValue
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';

const TradingCardOwnerCardInfo = (props) => {
  const styles = useStyle();

  const card = useFragment(graphql`
    fragment TradingCardOwnerCardInfo_card on Card {
      frontImageUrl
      ...CardFullNameText_card
      ...CardSetNameText_card
      ...CardMarketValue_card @arguments(assumedCondition: "Very Good")
    }`,
    props.card
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={card.frontImageUrl} style={styles.imageCover} />
        <View style={styles.textsContentContainer}>
          <View>
            <CardSetNameText style={styles.textSet} card={card} />
            <CardFullNameText style={styles.textTitle} card={card} />
          </View>
          <CardMarketValue
            style={styles.priceContainer}
            priceStyle={styles.textStatusValue}
            stateStyle={styles.textStatusDescription}
            card={card}
          />
        </View>
      </View>
    </View>
  );
};

export default TradingCardOwnerCardInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.secondaryCardBackground,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
    backgroundColor: colors.primaryCardBackground,
  },
  imageCover: {
    width: wp(18.6),
    height: wp(25.6),
    overflow: 'hidden',
  },
  textsContentContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  textSet: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginTop: 4,
  },
  priceContainer: {
    width: wp(25),
    height: wp(12.8),
  },
  textStatusValue: {
    fontSize: 15,
    lineHeight: 18,
  },
  textStatusDescription: {
    fontSize: 8,
    lineHeight: 10,
  },
}));
