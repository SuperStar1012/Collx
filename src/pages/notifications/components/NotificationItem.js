import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Image, Button, FollowButton} from 'components';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const dollarCircleIcon = require('assets/icons/more/dollar_circle.png');

const NotificationItem = ({
  style,
  viewer,
  notification,
  onPress,
  onAvatarPress,
  onViewCredit,
}) => {
  const styles = useStyle();

  const notificationData = useFragment(graphql`
    fragment NotificationItem_notification on Notification {
      __typename
      imageUrl
      message
      read
      who {
        id
        name
        avatarImageUrl
        viewer {
          amIFollowingThem
        }
        ...FollowButton_profile,
      }
      ...on CommentNotification {
        tradingCard {
          id
        }
      }
      ...on CommentReplyNotification {
        tradingCard {
          id
        }
      }
      ...on DeeplinkNotification {
        link
      }
      ...on LikeNotification {
        tradingCard {
          id
        }
      }
      ...on WeblinkNotification {
        link
      }
      ...on OrderNotification {
        link
      }
    }`,
    notification
  );

  const handleSelect = () => {
    if (onPress) {
      onPress(notificationData);
    }
  };

  const handleAvatarSelect = () => {
    if (onAvatarPress) {
      onAvatarPress(notificationData);
    }
  };

  const handleViewCredit = () => {
    if (onViewCredit) {
      onViewCredit();
    }
  };

  const renderAvatar = () => {
    let avatar = notificationData.who?.avatarImageUrl;
    let extraStyle = {};

    if (notificationData.__typename === Constants.notificationTypeName.creditNotification) {
      avatar = dollarCircleIcon;
      extraStyle = styles.imageDollar;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleAvatarSelect}>
        <Image
          style={[styles.imageAvatar, extraStyle]}
          source={avatar || Constants.defaultAvatar}
        />
      </TouchableOpacity>
    );
  };

  const renderRight = () => {
    if (notificationData.__typename === Constants.notificationTypeName.followNotification) {
      const {amIFollowingThem} = notificationData.who.viewer || {};

      return (
        <FollowButton
          style={amIFollowingThem ? styles.followingButton : styles.followButton}
          labelStyle={amIFollowingThem ? styles.textFollowingButton : styles.textFollowButton}
          viewer={viewer}
          profile={notificationData.who}
        />
      );
    } else if (notificationData.__typename === Constants.notificationTypeName.creditNotification) {
      return (
        <Button
          style={styles.viewButton}
          label="View"
          labelStyle={[styles.textNotification, styles.textView]}
          scale={Button.scaleSize.Two}
          onPress={handleViewCredit}
        />
      );
    } else if (notificationData.imageUrl) {
      return (
        <Image
          style={styles.imageCard}
          source={notificationData.imageUrl}
        />
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        notificationData.read ? styles.readContainer : styles.unreadContainer,
        style,
      ]}
      activeOpacity={0.9}
      onPress={handleSelect}>
      {renderAvatar()}
      <View style={styles.mainContentContainer}>
        <Text>
          <Text style={[styles.textNotification, styles.textName]}>
            {notificationData.who?.name}
          </Text>
          <Text style={styles.textNotification}>
            {` ${notificationData.message}`}
          </Text>
        </Text>
      </View>
      {renderRight()}
    </TouchableOpacity>
  );
};

NotificationItem.defaultProps = {};

NotificationItem.propTypes = {};

export default NotificationItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  readContainer: {
    backgroundColor: colors.primaryBackground,
    borderBottomColor: colors.secondaryCardBackground,
  },
  unreadContainer: {
    backgroundColor: colors.secondaryCardBackground,
    borderBottomColor: colors.primaryBackground,
  },
  imageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  imageDollar: {
    tintColor: colors.primary,
  },
  mainContentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  textName: {
    fontWeight: Fonts.bold,
  },
  textNotification: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  imageCard: {
    width: 43,
    height: 60,
    resizeMode: 'contain',
  },
  followButton: {
    backgroundColor: colors.primary,
  },
  textFollowButton: {
    color: Colors.white,
  },
  followingButton: {
    backgroundColor: colors.secondaryCardBackground,
  },
  textFollowingButton: {
    color: colors.primaryText,
  },
  viewButton: {
    width: 84,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  textView: {
    fontWeight: Fonts.semiBold,
    color: colors.white,
  },
}));
