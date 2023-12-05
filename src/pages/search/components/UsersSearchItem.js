import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Image, FollowButton} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const UsersSearchItem = ({
  style,
  viewer,
  profile,
  onPress,
}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment UsersSearchItem_profile on Profile {
      id
      name
      avatarImageUrl
      username
      ...FollowButton_profile
    }`,
    profile
  );

  const handleSelect = () => {
    if (onPress) {
      onPress(profileData.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={handleSelect}>
      <Image
        style={styles.imageAvatar}
        source={profileData.avatarImageUrl || Constants.defaultAvatar}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.textName} numberOfLines={1}>
          {profileData.name || "Anonymous"}
        </Text>
        <Text style={[styles.textOther, styles.textUsername]}>
          @{profileData.username}
        </Text>
      </View>
      <FollowButton
         viewer={viewer}
        profile={profileData}
      />
    </TouchableOpacity>
  );
};

export default UsersSearchItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  textName: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
  textUsername: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginTop: 6,
  },
}));
