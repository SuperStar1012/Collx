import React, {useState, useCallback, useEffect} from 'react';
import {graphql, useFragment} from 'react-relay';
import {View} from 'react-native';

import {
  FollowButton,
  NotificationButton,
  ConversationButton,
 } from 'components';

import {useActions} from 'actions';
import {Fonts, createUseStyle} from 'theme';

const ProfileActionsForOtherUsers = ({
  style,
  viewer,
  profile,
  onMessage,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const profileData = useFragment(graphql`
    fragment ProfileActionsForOtherUsers_profile on Profile {
      id
      viewer {
        areTheyBlockingMe
        amIFollowingThem
        amIAcceptingNotificationsFromThem
      }
      ...FollowButton_profile
    }`,
    profile
  );

  const viewerData = useFragment(graphql`
    fragment ProfileActionsForOtherUsers_viewer on Viewer {
      profile {
        id
      }
    }`,
    viewer
  );

  const [amIAcceptingNotificationsFromThem, setAmIAcceptingNotificationsFromThem] =
    useState(profileData.viewer.amIAcceptingNotificationsFromThem);

  const toggleAmIAcceptingNotificationsFromThem = useCallback(() => {
    setAmIAcceptingNotificationsFromThem(!amIAcceptingNotificationsFromThem);
  }, [amIAcceptingNotificationsFromThem]);

  useEffect(() => {
    if (profileData.viewer.amIAcceptingNotificationsFromThem != amIAcceptingNotificationsFromThem) {
      actions.acceptNotifications(profileData.id, amIAcceptingNotificationsFromThem);
    }
  }, [amIAcceptingNotificationsFromThem, profileData]);

  const handleConversation = () => {
    if (onMessage) {
      onMessage(viewerData.profile?.id, profileData.id);
    }
  };

  if (profileData.viewer.areTheyBlockingMe) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <FollowButton
        style={styles.followButton}
        profile={profileData} viewer={viewer}
      />
      {profileData.viewer.amIFollowingThem ? (
        <NotificationButton
          on={amIAcceptingNotificationsFromThem}
          onPress={toggleAmIAcceptingNotificationsFromThem}
        />
      ) : null}
      <ConversationButton onPress={handleConversation} />
    </View>
  );
};

export default ProfileActionsForOtherUsers;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 2,
  },
  textName: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primaryText,
  },
  followButton: {
    flex: 1,
  },
}));
