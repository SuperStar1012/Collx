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
  TradingCardCondition,
  CardPriceLabel,
} from 'components';

import {Constants, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {wp, getSetName, getNumberAndPlayer} from 'utils';

const circleIcon = require('assets/icons/more/circle.png');
const circleCheckIcon = require('assets/icons/more/checkmark_circle.png');

const ListViewItem = ({
  style,
  selectMode,
  isSelected,
  tradingCard,
  onPress,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment ListViewItem_tradingCard on TradingCard {
      id
      state
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
      condition {
        name
        gradingScale {
          name
        }
      }
      ...CardPriceLabel_tradingCard
      ...TradingCardCondition_tradingCard
    }`,
    tradingCard
  );

  const {
    owner,
    state,
    frontImageUrl,
  } = tradingCardData;
  const {
    id: canonicalCardId,
    set,
    number,
    player,
    name,
  } = tradingCardData?.card || {};

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

  const renderSelectMark = () => {
    if (selectMode === Constants.collectionSelectMode.none || disabled) {
      return null;
    }

    return (
      <View style={styles.iconWrapper}>
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
      {renderSelectMark()}
      <Image
        style={styles.imageCover}
        source={frontImageUrl || Constants.defaultCardImage}
      />
      <View style={styles.centerContainer}>
        <Text style={styles.textSubTitle} numberOfLines={1}>
          {getSetName(set?.name)}
        </Text>
        <Text style={styles.textTitle} numberOfLines={1}>
          {getNumberAndPlayer(number, player?.name, name, owner?.id, canonicalCardId)}
        </Text>
        <TradingCardCondition tradingCard={tradingCardData} />
      </View>
      <View style={styles.rightContainer}>
        <CardPriceLabel
          iconStyle={styles.iconPriceTag}
          tradingCard={tradingCardData}
          isShowIcon
        />
      </View>
    </TouchableOpacity>
  );
};

ListViewItem.defaultProps = {
  selectMode: Constants.collectionSelectMode.none,
  isSelected: false,
  onPress: () => {},
};

ListViewItem.propTypes = {
  selectMode: PropTypes.number,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func,
};

export default ListViewItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: wp(19) + 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryBorder,
  },
  imageCover: {
    width: wp(13.6),
    height: wp(19),
  },
  centerContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    marginHorizontal: 12,
  },
  textSubTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
    marginTop: 4,
  },
  rightContainer: {
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconPriceTag: {
    width: 20,
    height: 20,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginRight: 16,
  },
  iconSelect: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
}));
