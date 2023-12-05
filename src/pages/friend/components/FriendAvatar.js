import React from 'react';
import {
  View
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {createUseStyle} from 'theme';

const plusCircleIcon = require('assets/icons/plus.png');
const personFillIcon = require('assets/icons/more/person_crop_circle_fill.png');

const FriendAvatar = props => {
  const {
    style,
    avatarUrl,
  } = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image style={styles.imageAvatar} source={avatarUrl} />
        ): (
          <Image style={styles.iconPerson} source={personFillIcon} />
        )}
      </View>
      <View style={styles.addContainer}>
        <Image style={styles.iconPlusCircle} source={plusCircleIcon} />
       </View>
    </View>
  );
};

FriendAvatar.defaultProps = {};

FriendAvatar.propTypes = {
  avatarUrl: PropTypes.string,
};

export default FriendAvatar;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: 163,
    height: 130,
    marginBottom: 27,
  },
  avatarContainer: {
    position: 'absolute',
    right: 0,
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
    borderWidth: 12,
    borderColor: colors.primary,
  },
  addContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 42,
    borderWidth: 10,
    borderColor: colors.primaryBackground,
    backgroundColor: colors.primary,
  },
  iconPlusCircle: {
    width: 74,
    height: 74,
    tintColor: colors.primaryBackground,
  },
  iconPerson: {
    position: 'absolute',
    bottom: -5,
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  imageAvatar: {
    width: 106,
    height: 106,
    borderRadius: 53,
  },
}));
