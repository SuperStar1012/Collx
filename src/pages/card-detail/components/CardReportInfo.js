import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  Text,
  View,
  Image,
} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const exclamationIcon = require('assets/icons/exclamation_circle.png');

const CardReportInfo = ({
  style,
  tradingCard,
  canonicalCard,
}) => {
  const styles = useStyle();

  let isReported = false;

  if (tradingCard) {
    const tradingCardData = useFragment(graphql`
      fragment CardReportInfo_tradingCard on TradingCard {
        reported
      }`,
      tradingCard
    );

    isReported = tradingCardData.reported;
  } else if (canonicalCard) {
    const canonicalCardData = useFragment(graphql`
      fragment CardReportInfo_card on Card {
        reported
      }`,
      canonicalCard
    );

    isReported = canonicalCardData.reported;
  }

  if (!isReported) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.iconExclamation}
        source={exclamationIcon}
      />
      <Text style={styles.textDescription} numberOfLines={2}>
        This card has been reported as having incorrect information
      </Text>
    </View>
  );
};

export default CardReportInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.alertYellowBackground,
  },
  iconExclamation: {
    width: 24,
    height: 24,
    tintColor: colors.alertYellowColor,
  },
  textDescription: {
    flex: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.alertYellowColor,
    marginLeft: 6,
  },
}));
