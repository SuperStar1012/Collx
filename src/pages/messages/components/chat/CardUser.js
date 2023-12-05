import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const CardUser = ({
  style,
  name,
  avatarUri,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.imageAvatar}
        source={avatarUri || Constants.defaultAvatar}
      />
      <Text style={styles.textName}>{name}</Text>
    </View>
  );
};

CardUser.defaultProps = {};

CardUser.propTypes = {
  name: PropTypes.string,
  avatarUri: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  time: PropTypes.any,
};

export default CardUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  imageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  textName: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
    marginHorizontal: 8,
  },
}));
