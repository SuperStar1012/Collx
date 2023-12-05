import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {NavBarButton} from 'components';

import {Urls} from 'globals';

const settingsIcon = require('assets/icons/settings.png');
const addFriendsIcon = require('assets/icons/person_circle_plus.png');
const shareIcon = require('assets/icons/share.png');

const NavBarRightForMe = ({profile, actions}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment NavBarRightForMe_profile on Profile {
      username
    }`,
    profile
  );

  const handleAddFriends = () => {
    actions.navigateAddFriends();
  };

  const handleSettings = () => {
    actions.navigateSettings();
  };

  const handleShare = () => {
    actions.shareUrl(`${Urls.shareAppUrl}/${profileData.username}`);
  };

  return (
    <View style={styles.navBarRightContainer}>
      <NavBarButton
        style={styles.navBarButton}
        icon={addFriendsIcon}
        onPress={handleAddFriends}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={settingsIcon}
        onPress={handleSettings}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={shareIcon}
        onPress={handleShare}
      />
    </View>
  );
};

export default NavBarRightForMe;

const useStyle = () =>
  StyleSheet.create({
    navBarRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    navBarButton: {
      flex: 0,
      paddingHorizontal: 6,
    },
  });