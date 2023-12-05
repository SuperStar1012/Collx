import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button} from 'components';
import CardPhotos from './CardPhotos';

import {Fonts, createUseStyle} from 'theme';
import {getSetName, getNumberAndPlayer} from 'utils';

const CardMatchItem = props => {
  const {
    style,
    userId,
    cardId,
    frontImageUrl,
    front,
    number,
    set,
    player,
    name,
    hints,
    onSelect,
  } = props;

  const styles = useStyle();

  const handleSelectCard = () => {
    onSelect();
  };

  return (
    <View style={[styles.container, style]}>
      <CardPhotos
        style={styles.cardPhotoContainer}
        imageContainerStyle={styles.cardPhotoContainer}
        frontUri={frontImageUrl || front}
      />
      <View style={styles.mainContainer}>
        <Text style={styles.textSubTitle}>{getSetName(set)}</Text>
        <Text style={styles.textTitle}>
          {getNumberAndPlayer(number, player, name, userId, cardId)}
        </Text>
        {hints ? (
          <View style={styles.lookForContainer}>
            <Text style={styles.textDescription}>
              <Text style={styles.textBoldDescription}>Look For: </Text>
              {hints}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyLookForContainer} />
        )}
        <Button
          style={styles.selectButton}
          scale={Button.scaleSize.One}
          label="Select"
          labelStyle={styles.textSelect}
          onPress={() => handleSelectCard()}
        />
      </View>
    </View>
  );
};

CardMatchItem.defaultProps = {
  onSelect: () => {},
};

CardMatchItem.propTypes = {
  frontImageUrl: PropTypes.string,
  front: PropTypes.string, // captured card
  set: PropTypes.string,
  player: PropTypes.string,
  number: PropTypes.string,
  hints: PropTypes.string,
  onSelect: PropTypes.func,
};

export default CardMatchItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: colors.primaryCardBackground,
    borderBottomColor: colors.secondaryBorder,
  },
  cardPhotoContainer: {
    width: 88,
    height: 120,
    marginHorizontal: 0,
  },
  mainContainer: {
    flex: 1,
    marginLeft: 9,
  },
  textSubTitle: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginTop: 5,
  },
  lookForContainer: {
    flex: 1,
    padding: 6,
    marginVertical: 6,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },
  emptyLookForContainer: {
    flex: 1,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.lightGrayText,
  },
  textBoldDescription: {
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  selectButton: {
    height: 24,
    backgroundColor: colors.secondaryCardBackground,
    borderRadius: 4,
  },
  textSelect: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textTransform: 'capitalize',
  },
}));
