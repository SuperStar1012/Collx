import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Image} from 'components';

import {Constants} from 'globals';
import {wp} from 'utils';
import {useActions} from 'actions';
import {createUseStyle} from 'theme';

const ReferralFriendsItem = props => {
  const {style} = props;

  const styles = useStyle();

  const actions = useActions();

  const redemption = useFragment(graphql`
    fragment ReferralFriendsItem_ReferralProgramReferRedemption on ReferralProgramReferRedemption {
      state
      profile {
        id
        avatarImageUrl
      }
    }`,
    props.redemption
  );

  if (!redemption) {
    return <View style={[styles.container, styles.emptyContainer, style]} />;
  }

  const handleOpenProfile = () => {
    if (redemption?.profile?.id) {
      actions.pushProfile(redemption?.profile?.id)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, styles.avatarContainer, style]}
      activeOpacity={0.9}
      onPress={handleOpenProfile}
    >
      <Image
        source={redemption?.profile?.avatarImageUrl || Constants.defaultAvatar}
        style={styles.imageAvatar}
      />
    </TouchableOpacity>
  );
};

ReferralFriendsItem.defaultProps = {};

ReferralFriendsItem.propTypes = {};

export default ReferralFriendsItem;

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
