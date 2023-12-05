import React, {useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {
  Image,
  Button,
  TradingCardListingPrice,
  TradingCardCondition,
} from 'components';

import {Constants, SchemaTypes, Styles} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, getSetName, getNumberAndPlayer} from 'utils';

const circleIcon = require('assets/icons/more/circle.png');
const circleCheckIcon = require('assets/icons/more/checkmark_circle.png');
const starFilledIcon = require('assets/icons/more/star.png');
const starOutlineIcon = require('assets/icons/star_outline.png');
const heartFilledIcon = require('assets/icons/more/heart.png');
const heartOutlineIcon = require('assets/icons/heart.png');

const itemMargin = 16;

const GridViewItem = ({
  style,
  selectMode,
  isSelected,
  tradingCard,
  onPress,
  onPinFeature,
  onPinUnfeature,
  onToggleLike,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment GridViewItem_tradingCard on TradingCard {
      id
      state
      featured
      frontImageUrl
      owner {
        id
      }
      card {
        id,
        name
        number
        set {
          name
        }
        ...on SportCard {
          player {
            name
          }
        }
      }
      viewer {
        isLikedByMe
      }
      condition {
        name
        gradingScale {
          name
        }
      }
      ...TradingCardListingPrice_tradingCard
      ...TradingCardCondition_tradingCard
    }`,
    tradingCard
  );

  const {
    id: tradingCardId,
    owner,
    state,
    featured,
    frontImageUrl,
  } = tradingCardData || {};
  const {
    id: canonicalCardId,
    set,
    number,
    player,
    name,
  } = tradingCardData?.card || {};

  const isLike = tradingCardData.viewer?.isLikedByMe;

  const disabled = useMemo(() => (
    selectMode === Constants.collectionSelectMode.otherUser &&
    state !== SchemaTypes.tradingCardState.ACCEPTING_OFFERS &&
    state !== SchemaTypes.tradingCardState.LISTED
  ), [state, selectMode]);

  const handleSelect = () => {
    if (onPress) {
      onPress(tradingCardData);
    }
  };

  const handlePinToggleFeature = () => {
    if (onPinFeature && onPinUnfeature) {
      if (featured) {
        onPinUnfeature(tradingCardId)
        return;
      }
      onPinFeature(tradingCardId);
    }
  }

  const handleToggleLike = () => {
    if(!tradingCardId)
      return;
    onToggleLike(tradingCardId, isLike);
  }

  const renderToggleFeature = () => {
    if(onToggleLike && tradingCardId) {
      return (
        <Button
          style={styles.featureContainer}
          icon={isLike ? heartFilledIcon : heartOutlineIcon}
          iconStyle={isLike ? styles.iconFilledStar : styles.iconOutlineStar}
          scale={Button.scaleSize.Two}
          onPress={handleToggleLike}
        />
      );
    }

    if (!onPinFeature || !onPinUnfeature) {
      return null;
    }

    return (
      <Button
        style={styles.featureContainer}
        icon={featured ? starFilledIcon : starOutlineIcon}
        iconStyle={featured ? styles.iconFilledStar : styles.iconOutlineStar}
        scale={Button.scaleSize.Two}
        onPress={handlePinToggleFeature}
      />
    );
  };

  const renderSelectMark = () => {
    if (selectMode === Constants.collectionSelectMode.none || disabled) {
      return null;
    }

    return (
      <View style={styles.selectContainer}>
        <Image
          style={styles.iconSelect}
          source={isSelected ? circleCheckIcon : circleIcon}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      disabled={disabled}
      onPress={handleSelect}>
      <View style={styles.imageContainer}>
        <Image style={styles.imageCover} source={frontImageUrl || Constants.defaultCardImage} />
        {renderToggleFeature()}
        {renderSelectMark()}
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.textSubTitle} numberOfLines={1}>
          {getSetName(set?.name)}
        </Text>
        <Text style={styles.textTitle} numberOfLines={1}>
          {getNumberAndPlayer(number, player?.name, name, owner?.id, canonicalCardId)}
        </Text>
      </View>
      <View style={styles.rowContainer}>
        <TradingCardListingPrice tradingCard={tradingCardData} />
        <TradingCardCondition
          style={styles.conditionContainer}
          tradingCard={tradingCardData}
        />
      </View>
    </TouchableOpacity>
  );
};

GridViewItem.defaultProps = {
  selectMode: Constants.collectionSelectMode.none,
  isSelected: false,
  onPress: () => {},
};

GridViewItem.propTypes = {
  selectMode: PropTypes.number,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func,
};

export default GridViewItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: Math.floor((Styles.windowWidth - itemMargin * 3) / 2),
    // margin: 8,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: wp(60.5),
  },
  imageCover: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    flex: 1,
  },
  textSubTitle: {
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginTop: 9,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 17,
    lineHeight: 22,
    color: colors.primaryText,
    marginTop: 6,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  featureContainer: {
    position: 'absolute',
    left: 6,
    top: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.blackAlpha5,
    overflow: 'hidden',
  },
  iconFilledStar: {
    width: 22,
    height: 22,
  },
  iconOutlineStar: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
  selectContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  iconSelect: {
    width: '100%',
    height: '100%',
  },
  conditionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 5,
  },
}));
