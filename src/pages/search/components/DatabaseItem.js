import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {
  CardPhotos,
  CardPriceLabel,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {getSetName, getNumberAndPlayer, removeZeroDecimal} from 'utils';

const DatabaseItem = ({
  style,
  card,
  onPress,
}) => {
  const styles = useStyle();

  const cardData = useFragment(graphql`
    fragment DatabaseItem_card on Card {
      id,
      frontImageUrl,
      name
      number
      set {
        name
      }
      tradingCards(with: {states: [LISTED]}) {
        count
        totalCount
        askingPriceSpread {
          min {
            amount
            formattedAmount
          }
          max {
            amount
            formattedAmount
          }
        }
      }
      ...on SportCard {
        player {
          name
        }
      }
      ...CardPriceLabel_card
    }`,
    card
  );

  const {
    id,
    frontImageUrl,
    backImageUrl,
    number,
    set,
    player,
    name,
    tradingCards: {
      count,
      totalCount,
      askingPriceSpread: {
        min,
        max,
      },
    },
  } = cardData;

  const prices = useMemo(() => {
    if (min?.amount === max?.amount) {
      return removeZeroDecimal(min?.formattedAmount);
    }

    return `${removeZeroDecimal(min?.formattedAmount)}-${removeZeroDecimal(max?.formattedAmount)}`
  }, [min, max]);

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const renderSaleInfo = () => {
    if (totalCount <= 0 || count <=0) {
      return null;
    }

    return (
      <View style={styles.saleInfoContainer}>
        <Text style={styles.textSale}>
          <Text style={styles.textSaleBold}>{count}</Text> of {totalCount} For Sale
        </Text>
        {prices ? (
          <>
            <View style={styles.verticalLine} />
            <Text
              style={[styles.textSale, styles.textSaleBold, styles.textPrice]}
              numberOfLines={1}
            >
              {prices}
            </Text>
          </>
        ) : null}
      </View>
    );
  };

  const renderCardInfo = () => (
    <>
      <View style={styles.infoContainer}>
        <Text style={styles.textSubTitle}>
          {getSetName(set?.name)}
        </Text>
        <Text
          style={styles.textTitle}
          numberOfLines={1}
        >
          {getNumberAndPlayer(number, player?.name, name)}
        </Text>
        {renderSaleInfo()}
      </View>
      <CardPriceLabel canonicalCard={cardData} />
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <CardPhotos
        style={styles.cardPhotoContainer}
        imageContainerStyle={styles.cardPhotoContainer}
        isCameraCapture={false}
        frontUri={frontImageUrl}
        backUri={backImageUrl}
      />
      {renderCardInfo()}
    </TouchableOpacity>
  );
};

DatabaseItem.defaultProps = {
  onPress: () => {},
};

DatabaseItem.propTypes = {
  card: PropTypes.object,
  onPress: PropTypes.func,
};

export default DatabaseItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  cardPhotoContainer: {
    marginHorizontal: 0,
    width: 45,
    height: 62,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  textSubTitle: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.24,
    color: colors.grayText,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
    marginTop: 6,
  },
  saleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pricesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textPrice: {
    flex: 1,
  },
  textSale: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
  },
  textSaleBold: {
    fontWeight: Fonts.bold,
  },
  verticalLine: {
    height: '80%',
    width: 1,
    backgroundColor: colors.quaternaryBorder,
    marginHorizontal: 5,
  },
}));
