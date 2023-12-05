import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {Constants} from 'globals';
import {wp} from 'utils';
import {createUseStyle} from 'theme';

const ReferralFriendsItemOriginal = props => {
  const {style, referral, onPress} = props;

  const styles = useStyle();

  const isEmpty = !Object.keys(referral).length;

  if (isEmpty) {
    return <View style={[styles.container, styles.emptyContainer, style]} />;
  }

  return (
    <TouchableOpacity
      style={[styles.container, styles.avatarContainer, style]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={referral.avatarImageUrl || Constants.defaultAvatar}
        style={styles.imageAvatar}
      />
    </TouchableOpacity>
  );
};

ReferralFriendsItemOriginal.defaultProps = {
  onPress: () => {},
};

ReferralFriendsItemOriginal.propTypes = {
  referrals: PropTypes.array,
  onPress: PropTypes.func,
};

export default ReferralFriendsItemOriginal;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    borderWidth: 2,
    overflow: 'hidden',
  },
  imageAvatar: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    borderColor: colors.primary,
  },
  emptyContainer: {
    borderStyle: 'dashed',
    borderColor: colors.darkGrayText,
  },
}));
