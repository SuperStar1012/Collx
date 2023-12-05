import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image, Condition} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {getSetName, getNumberAndPlayer} from 'utils';

const CardContent = ({
  style,
  userId,
  cardId,
  frontImageUrl,
  set,
  number,
  player,
  name,
  grade,
  condition,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image source={frontImageUrl} style={styles.imageCover} />
      <View style={styles.contentContainer}>
        <Text style={styles.textSubTitle} numberOfLines={1}>
          {getSetName(set)}
        </Text>
        <Text style={styles.textTitle} numberOfLines={1}>
          {getNumberAndPlayer(number, player, name, userId, cardId)}
        </Text>
        <Condition condition={condition} grade={grade} />
      </View>
    </View>
  );
};

CardContent.defaultProps = {};

CardContent.propTypes = {
  frontImageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  number: PropTypes.string,
  player: PropTypes.string,
  condition: PropTypes.string,
  grade: PropTypes.string,
};

export default CardContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 13,
    paddingBottom: 19,
  },
  imageCover: {
    width: 69,
    height: 96,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.blackAlpha1,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
  },
  textSubTitle: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginBottom: 4,
  },
  textTitle: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginBottom: 7,
  },
}));
