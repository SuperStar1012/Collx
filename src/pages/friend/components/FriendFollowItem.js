import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  FollowButtonOriginal,
  Image,
  CardCountAndLocation,
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const FriendFollowItem = props => {
  const {
    style,
    isAnonymousUser,
    name,
    followed,
    avatarImageUrl,
    cardCount,
    location,
    onFollow,
    onPress,
  } = props;

  const styles = useStyle();

  const handleFollow = value => {
    if (onFollow) {
      onFollow(value);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={handlePress}>
      <Image
        style={styles.imageAvatar}
        source={avatarImageUrl || Constants.defaultAvatar}
      />
      <View style={styles.mainContentContainer}>
        <Text style={styles.textName}>{name}</Text>
        <CardCountAndLocation cardCount={cardCount} location={location} />
      </View>
      <FollowButtonOriginal
        followed={followed}
        isAnonymousUser={isAnonymousUser}
        immediateUpdate
        onFollow={handleFollow}
      />
    </TouchableOpacity>
  );
};

FriendFollowItem.defaultProps = {
  onFollow: () => {},
  onPress: () => {},
};

FriendFollowItem.propTypes = {
  isAnonymousUser: PropTypes.bool,
  name: PropTypes.string,
  followed: PropTypes.bool,
  cardCount: PropTypes.number,
  location: PropTypes.string,
  avatarImageUrl: PropTypes.string,
  onFollow: PropTypes.func,
  onPress: PropTypes.func,
};

export default FriendFollowItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
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
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
}));
