import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Image} from 'components';
import TradingCardConditionAndFlags from '../trading-card/TradingCardConditionAndFlags';
import CardPriceLabel from './CardPriceLabel';

import {Fonts, createUseStyle} from 'theme';
import {wp, getSetName, getNumberAndPlayer} from 'utils';

const RecentListingItem = props => {
  const {style, onPress} = props;

  const styles = useStyle();

  const tradingCard = useFragment(graphql`
    fragment RecentListingItem_tradingCard on TradingCard {
      id
      frontImageUrl
      card {
        name
        number
        year
        set {
          name
        }
        ...on SportCard {
          player {
            name
          }
        }
      }
      ...TradingCardConditionAndFlags_tradingCard
      ...CardPriceLabel_tradingCard,
    }`,
    props.tradingCard
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <Image source={tradingCard.frontImageUrl} style={styles.imageCover} />
      <View style={styles.centerContainer}>
        <Text style={styles.textSubTitle} numberOfLines={1}>
          {getSetName(tradingCard.card.set?.name)}
        </Text>
        <Text style={styles.textTitle} numberOfLines={1}>
          {getNumberAndPlayer(tradingCard.card.number, tradingCard.card.player?.name, tradingCard.card.name)}
        </Text>
        <TradingCardConditionAndFlags tradingCard={tradingCard} />
      </View>
      <CardPriceLabel tradingCard={tradingCard} />
    </TouchableOpacity>
  );
};

RecentListingItem.defaultProps = {
  onPress: () => {},
};

RecentListingItem.propTypes = {
  card: PropTypes.object,
  onPress: PropTypes.func,
};

export default RecentListingItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: wp(19) + 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
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
}));
