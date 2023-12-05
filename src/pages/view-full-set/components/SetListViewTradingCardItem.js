import React from 'react';
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

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {wp, getSetName, getNumberAndPlayer} from 'utils';

const SetListViewTradingCardItem = ({
  style,
  tradingCard,
  onPress,
}) => {
  const styles = useStyle();

  const queryTradingCard = useFragment(graphql`
    fragment SetListViewTradingCardItem_tradingCard on TradingCard {
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

  const {owner, frontImageUrl} = queryTradingCard;
  const {id: cardId, set, number, player, name} = queryTradingCard?.card || {};

  const handleSelect = () => {
    if (onPress) {
      onPress(queryTradingCard);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}>
      <Image
        style={styles.imageCover}
        source={frontImageUrl || Constants.defaultCardImage}
      />
      <View style={styles.centerContainer}>
        <Text style={styles.textSubTitle} numberOfLines={1}>
          {getSetName(set?.name)}
        </Text>
        <Text style={styles.textTitle} numberOfLines={1}>
          {getNumberAndPlayer(number, player?.name, name, owner?.id, cardId)}
        </Text>
        <TradingCardCondition tradingCard={queryTradingCard} />
      </View>
      <View style={styles.rightContainer}>
        <CardPriceLabel
          iconStyle={styles.iconPriceTag}
          tradingCard={queryTradingCard}
          isShowIcon
        />
      </View>
    </TouchableOpacity>
  );
};

SetListViewTradingCardItem.defaultProps = {
  onPress: () => {},
};

SetListViewTradingCardItem.propTypes = {
  onPress: PropTypes.func,
};

export default SetListViewTradingCardItem;

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
}));
