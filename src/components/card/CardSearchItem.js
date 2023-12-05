import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {CardPriceLabelOriginal} from 'components';
import CardPhotos from './CardPhotos';

import {Fonts, createUseStyle} from 'theme';
import {getSetName, getNumberAndPlayer} from 'utils';

const CardSearchItem = props => {
  const {style, card, onPress} = props;

  const {
    userId,
    cardId,
    frontImageThumbnailUrl,
    frontImageUrl,
    backImageThumbnailUrl,
    backImageUrl,
    front,
    back,
    cardState,
    number,
    set,
    player,
    name,
  } = card;

  const styles = useStyle();

  const handlePress = () => {
    onPress();
  };

  const renderCardInfo = () => (
    <>
      <View style={styles.infoContainer}>
        <Text style={styles.textSubTitle}>{getSetName(set)}</Text>
        <Text style={styles.textTitle}>
          {getNumberAndPlayer(number, player, name, userId, cardId)}
        </Text>
      </View>
      <CardPriceLabelOriginal card={card} />
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <CardPhotos
        style={styles.cardPhotoContainer}
        isCameraCapture={false}
        frontUri={front || frontImageThumbnailUrl || frontImageUrl}
        backUri={back || backImageThumbnailUrl || backImageUrl}
        // cardState={!id ? cardState : Constants.cardSearchState.none}
        cardState={cardState}
      />
      {renderCardInfo()}
    </TouchableOpacity>
  );
};

CardSearchItem.defaultProps = {
  onPress: () => {},
};

CardSearchItem.propTypes = {
  card: PropTypes.object,
  onPress: PropTypes.func,
};

export default CardSearchItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // height: 80,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  cardPhotoContainer: {
    marginHorizontal: 0,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
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
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginTop: 3,
  },
}));
