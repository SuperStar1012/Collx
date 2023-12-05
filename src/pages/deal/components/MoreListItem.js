import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {TouchableOpacity, View} from 'react-native';

import {
  Image,
  Button,
  TradingCardSetNameText,
  TradingCardConditionAndFlags,
  TradingCardListingPrice,
  TradingCardNumberAndPlayerText,
} from 'components';

import {wp} from 'utils';
import {Colors, createUseStyle} from 'theme';

const cartBadgePlusIcon = require('assets/icons/cart_badge_plus_outline.png');
const cartBadgeMinusIcon = require('assets/icons/cart_badge_minus_outline.png');

const MoreListItem = (props) => {
  const {style, onAddCard, onRemoveCard, onSelect} = props;

  const styles = useStyle();

  const tradingCard = useFragment(
    graphql`
      fragment MoreListItem_tradingCard on TradingCard {
        id
        frontImageUrl
        owner {
          id
          name
          avatarImageUrl
        }
        activeDeal {
          id
        }
        ...TradingCardSetNameText_tradingCard
        ...TradingCardNumberAndPlayerText_tradingCard
        ...TradingCardListingPrice_tradingCard
        ...TradingCardConditionAndFlags_tradingCard
      }
    `,
    props.tradingCard,
  );

  const handleSelect = () => {
    if (onSelect) {
      onSelect(tradingCard.id);
    }
  };

  const handleAddCart = () => {
    if (onAddCard) {
      onAddCard(tradingCard.owner.id, tradingCard.id);
    }
  };

  const handleRemoveCart = () => {
    if (onRemoveCard) {
      onRemoveCard(tradingCard.owner.id, tradingCard.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}>
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
        <TradingCardConditionAndFlags tradingCard={tradingCard} />
        <View style={styles.bottomContainer}>
          <TradingCardListingPrice tradingCard={tradingCard} />
          {tradingCard.activeDeal ? (
            <Button
              icon={cartBadgeMinusIcon}
              iconStyle={[styles.iconCartBadge, styles.iconMinusCartBadge]}
              scale={Button.scaleSize.Three}
              onPress={handleRemoveCart}
            />
          ) : (
            <Button
              icon={cartBadgePlusIcon}
              iconStyle={[styles.iconCartBadge, styles.iconPlusCartBadge]}
              scale={Button.scaleSize.Three}
              onPress={handleAddCart}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MoreListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(44.8),
    height: wp(92.3),
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: colors.primaryCardBackground,
  },
  imageCover: {
    width: '98%',
    height: wp(61),
    marginTop: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCartBadge: {
    width: 28,
    height: 28,
  },
  iconPlusCartBadge: {
    tintColor: colors.primary,
  },
  iconMinusCartBadge: {
    tintColor: Colors.red,
  },
}));
