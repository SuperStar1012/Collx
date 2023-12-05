import React, {useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useFragment, graphql} from 'react-relay';

import {Image, Button} from 'components';
import {
  TradingCardConditionAndFlags,
  TradingCardSetNameText,
  TradingCardListingPrice,
  TradingCardNumberAndPlayerText,
} from '../trading-card';

import {Constants, SchemaTypes} from 'globals';
import {Colors, createUseStyle} from 'theme';

const clockIcon = require('assets/icons/clock.png');
const cartBadgePlusOutlineIcon = require('assets/icons/cart_badge_plus_outline.png');
const removeIcon = require('assets/icons/trash.png');

const DealCardItem = (props) => {
  const {
    style,
    onSelectCard,
    onAddToDeal,
    onSaveForLater,
    onRemoveCard,
  } = props;

  const styles = useStyle();

  const tradingCard = useFragment(graphql`
    fragment DealCardItem_tradingCard on TradingCard {
      id
      state
      frontImageUrl
      owner {
        id
      }
      activeDeal {
        id
      }
      ...TradingCardSetNameText_tradingCard
      ...TradingCardNumberAndPlayerText_tradingCard
      ...TradingCardListingPrice_tradingCard
      ...TradingCardConditionAndFlags_tradingCard
    }`,
    props.tradingCard
  );

  const isNoLongerAvailable = useMemo(() => {
    return tradingCard?.state === SchemaTypes.tradingCardState.SOLD || tradingCard?.state === SchemaTypes.tradingCardState.NOT_FOR_SALE;
  }, [tradingCard?.state]);

  const handleSelect = () => {
    if (onSelectCard) {
      onSelectCard(tradingCard.id);
    }
  };

  const handleSaveForLater = () => {
    if (onSaveForLater) {
      onSaveForLater(tradingCard.id);
    }
  };

  const handleAddToDeal = () => {
    if (onAddToDeal) {
      onAddToDeal(tradingCard.owner.id, tradingCard.id);
    }
  };

  const handleRemove = () => {
    if (onRemoveCard) {
      onRemoveCard(tradingCard.owner.id, tradingCard.id);
    }
  };

  const renderMoreActions = () => {
    if (onAddToDeal) {
      return (
        <Button
          style={styles.button}
          icon={cartBadgePlusOutlineIcon}
          iconStyle={[styles.iconButton, styles.iconAddToDeal]}
          label="Add To Deal"
          labelStyle={[styles.textButton, styles.textAddToDeal]}
          disabled={!!tradingCard?.activeDeal}
          scale={Button.scaleSize.One}
          onPress={handleAddToDeal}
        />
      );
    } else if (onSaveForLater) {
      return (
        <Button
          style={styles.button}
          icon={clockIcon}
          iconStyle={[styles.iconButton, styles.iconSave]}
          label="Save for later"
          labelStyle={[styles.textButton, styles.textSave]}
          scale={Button.scaleSize.One}
          onPress={handleSaveForLater}
        />
      );
    }

    return null;
  };

  const renderCardActions = () => {
    if (!onAddToDeal && !onSaveForLater) {
      return <View style={styles.emptyActionsContainer} />;
    }

    return (
      <View style={styles.actionsContainer}>
        {renderMoreActions()}
        <Button
          style={styles.button}
          icon={removeIcon}
          iconStyle={[
            styles.iconButton,
            isNoLongerAvailable ? styles.iconRemoveForNoLonger : styles.iconRemove,
          ]}
          label="Remove"
          labelStyle={[
            styles.textButton,
            isNoLongerAvailable ? styles.textRemoveForNoLonger : styles.textRemove,
          ]}
          scale={Button.scaleSize.One}
          onPress={handleRemove}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}
    >
      <Image
        style={[styles.imageCard, isNoLongerAvailable && styles.imageCardForNoLonger]}
        source={tradingCard.frontImageUrl || Constants.defaultCardImage}
      />
      <View style={styles.mainContentContainer}>
        <TradingCardSetNameText tradingCard={tradingCard} />
        <TradingCardNumberAndPlayerText tradingCard={tradingCard} />
        <TradingCardConditionAndFlags
          style={styles.conditionContainer}
          tradingCard={tradingCard}
        />
        <TradingCardListingPrice
          style={styles.priceContainer}
          tradingCard={tradingCard}
        />
        {renderCardActions()}
      </View>
    </TouchableOpacity>
  );
};

export default DealCardItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageCard: {
    width: 90,
    height: 125,
    overflow: 'hidden',
  },
  imageCardForNoLonger: {
    opacity: 0.5,
  },
  mainContentContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  conditionContainer: {
    marginVertical: 8,
  },
  priceContainer: {
    justifyContent: 'flex-start',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyActionsContainer: {
    height: 24,
  },
  button: {
    paddingVertical: 2,
  },
  textButton: {
    fontSize: 13,
    lineHeight: 18,
  },
  iconButton: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  textSave: {
    color: Colors.yellow,
  },
  iconSave: {
    tintColor: Colors.yellow,
  },
  textSaveDisabled: {
    color: Colors.yellow,
  },
  iconSaveDisabled: {
    tintColor: Colors.darkGray,
  },
  iconRemove: {
    tintColor: Colors.darkGray,
  },
  iconRemoveForNoLonger: {
    tintColor: Colors.red,
  },
  textRemove: {
    color: Colors.darkGray,
  },
  textRemoveForNoLonger: {
    color: Colors.red,
  },
  iconAddToDeal: {
    tintColor: colors.primary,
  },
  textAddToDeal: {
    color: colors.primary,
  },
}));
