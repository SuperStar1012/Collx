import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {
  Image,
  CardCountAndLocation,
  FollowButton
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const UserFollowItem = ({
  style,
  viewer,
  profile,
  onPress,
}) => {
  const styles = useStyle();

  const queryProfile = useFragment(graphql`
    fragment UserFollowItem_profile on Profile {
      id
      name
      avatarImageUrl
      isAnonymous
      location
      viewer {
        amIFollowingThem
      }
      ...FollowButton_profile
    }`,
    profile
  );

  const handlePress = () => {
    if (onPress) {
      onPress(queryProfile.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={handlePress}>
      <Image
        style={styles.imageAvatar}
        source={queryProfile.avatarImageUrl || Constants.defaultAvatar}
      />
      <View style={styles.mainContentContainer}>
        <Text style={styles.textName}>{queryProfile.name}</Text>
        <CardCountAndLocation location={queryProfile.location} />
      </View>
      <FollowButton profile={queryProfile} viewer={viewer} />
    </TouchableOpacity>
  );
};

UserFollowItem.defaultProps = {
  onPress: () => {},
};

UserFollowItem.propTypes = {
  onPress: PropTypes.func,
};

export default UserFollowItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mainContentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 11,
  },
  textName: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
}));
