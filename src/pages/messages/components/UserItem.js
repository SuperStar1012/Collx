import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const UserItem = ({
  style,
  name,
  avatarImageUrl,
  onPress,
}) => {
  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <Image
        style={styles.imageAvatar}
        source={avatarImageUrl || Constants.defaultAvatar}
      />
      <Text style={styles.textName}>{name || 'Anonymous'}</Text>
    </TouchableOpacity>
  );
};

UserItem.defaultProps = {
  onPress: () => {},
};

UserItem.propTypes = {
  name: PropTypes.string,
  avatarImageUrl: PropTypes.string,
  onPress: PropTypes.func,
};

export default UserItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryCardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryBorder,
    paddingHorizontal: 16,
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  textName: {
    flex: 1,
    fontSize: 17,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginLeft: 12,
  },
}));
