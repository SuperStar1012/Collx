import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import {
  Image,
  CardPriceLabel,
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {wp, getSetName, getNumberAndPlayer} from 'utils';

const SetListViewCanonicalCardItem = ({
  style,
  canonicalCard,
  onPress,
}) => {
  const styles = useStyle();

  const queryCanonicalCard = useFragment(graphql`
    fragment SetListViewCanonicalCardItem_card on Card {
      id
      frontImageUrl
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
      ...CardPriceLabel_card
    }`,
    canonicalCard
  );

  const {id, set, number, player, name, frontImageUrl} = queryCanonicalCard;

  const handleSelect = () => {
    if (onPress) {
      onPress(queryCanonicalCard);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleSelect}>
      <Grayscale>
        <Image
          style={styles.imageCover}
          source={frontImageUrl || Constants.defaultCardImage}
        />
      </Grayscale>
      <View style={styles.centerContainer}>
        <Text style={styles.textSubTitle} numberOfLines={1}>
          {getSetName(set?.name)}
        </Text>
        <Text style={styles.textTitle} numberOfLines={1}>
          {getNumberAndPlayer(number, player?.name, name, null, id)}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <CardPriceLabel
          iconStyle={styles.iconPriceTag}
          canonicalCard={queryCanonicalCard}
        />
      </View>
    </TouchableOpacity>
  );
};

SetListViewCanonicalCardItem.defaultProps = {
  onPress: () => {},
};

SetListViewCanonicalCardItem.propTypes = {
  onPress: PropTypes.func,
};

export default SetListViewCanonicalCardItem;

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
    justifyContent: 'space-around',
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
