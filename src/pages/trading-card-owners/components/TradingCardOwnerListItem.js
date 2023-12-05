import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Image,
  TradingCardConditionAndFlags,
  TradingCardMarketValue
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';
import {useActions} from 'actions';

const TradingCardOwnerListItem = (props) => {
  const styles = useStyle();
  const actions = useActions();

  const tradingCard = useFragment(graphql`
    fragment TradingCardOwnerListItem_tradingCard on TradingCard {
      id
      condition {
        name
      }
      owner {
        name
        avatarImageUrl
      }
      ...TradingCardMarketValue_tradingCard
      ...TradingCardConditionAndFlags_tradingCard
    }`,
    props.tradingCard
  );

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      activeOpacity={0.9}
      onPress={() => actions.pushTradingCardDetail(tradingCard.id)}>
      <Image
        source={tradingCard.owner?.avatarImageUrl || Constants.defaultAvatar}
        style={styles.imageCover}
      />
      <View style={styles.centerContainer}>
        <Text style={styles.textTitle} numberOfLines={1}>
          {tradingCard.owner?.name || Constants.defaultName}
        </Text>
        <TradingCardConditionAndFlags tradingCard={tradingCard} />
      </View>
      <TradingCardMarketValue
        style={styles.priceContainer}
        tradingCard={tradingCard}
      />
    </TouchableOpacity>
  );
};

export default TradingCardOwnerListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: wp(22.5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  imageCover: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
  },
  centerContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
    marginBottom: 9,
  },
  priceContainer: {
    width: wp(22.6),
    height: wp(13.6),
  },
}));
