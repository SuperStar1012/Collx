import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Image,
  TradingCardSetNameText,
  TradingCardCondition,
  TradingCardListingPrice,
  TradingCardNumberAndPlayerText,
  ProBadge,
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';
import {wp} from 'utils';

const FeaturedListingsItem = (props) => {
  const styles = useStyle();
  const actions = useActions();

  const tradingCard = useFragment(graphql`
    fragment FeaturedListingsItem_tradingCard on TradingCard {
      id
      frontImageUrl
      owner {
        id
        name
        avatarImageUrl
        ...ProBadge_profile
      }
      ...TradingCardSetNameText_tradingCard
      ...TradingCardNumberAndPlayerText_tradingCard
      ...TradingCardListingPrice_tradingCard
      ...TradingCardCondition_tradingCard
    }`,
    props.tradingCard
  );

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      activeOpacity={0.9}
      onPress={() => actions.pushTradingCardDetail(tradingCard.id)}>
      <Image source={tradingCard.frontImageUrl} style={styles.imageCover} />
      <View style={styles.mainContainer}>
        <TradingCardSetNameText
          style={styles.textSet}
          tradingCard={tradingCard}
        />
        <TradingCardNumberAndPlayerText
          style={styles.textNumberAndPlayer}
          tradingCard={tradingCard}
        />
        <View style={styles.priceContainer}>
          <TradingCardListingPrice tradingCard={tradingCard} />
          <TradingCardCondition
            style={styles.conditionContainer}
            tradingCard={tradingCard}
          />
        </View>
        <View style={styles.userContainer}>
          <Image
            source={tradingCard.owner.avatarImageUrl || Constants.defaultAvatar}
            style={styles.imageAvatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.textName} numberOfLines={1}>
              {tradingCard.owner.name || Constants.collxName}
            </Text>
            <ProBadge
              style={styles.proBadge}
              profile={tradingCard.owner}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedListingsItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(44),
    height: wp(90),
    borderRadius: 10,
    marginHorizontal: 6,
    overflow: 'hidden',
    backgroundColor: colors.primaryCardBackground,
  },
  imageCover: {
    flex: 1,
    width: '98%',
    marginTop: 2,
    marginHorizontal: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignSelf: 'center',
  },
  mainContainer: {
    margin: 8,
    justifyContent: 'space-between',
  },
  textSet: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  textNumberAndPlayer: {
    fontSize: 15,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  imageAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    flex: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -0.004,
    color: colors.grayText,
  },
  proBadge: {
    marginRight: 0,
  },
  conditionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 5,
  },
}));
