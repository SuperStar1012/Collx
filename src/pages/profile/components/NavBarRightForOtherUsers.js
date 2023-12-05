import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {NavBarButton} from 'components';

import {Urls} from 'globals';

const ellipsisIcon = require('assets/icons/ellipsis.png');
const shareIcon = require('assets/icons/share.png');

const NavBarRightForOtherUsers = ({profile, actions}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment NavBarRightForOtherUsers_profile on Profile {
      username
    }`,
    profile
  );

  const handleActions = () => {
    actions.displayUserActionSheet();
  };

  const handleShare = () => {
    actions.shareUrl(`${Urls.shareAppUrl}/${profileData.username}`);
  };

  return (
    <View style={styles.container}>
      <NavBarButton
        style={styles.navBarButton}
        icon={ellipsisIcon}
        onPress={handleActions}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={shareIcon}
        onPress={handleShare}
      />
    </View>
  );
};

export default NavBarRightForOtherUsers;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    navBarButton: {
      flex: 0,
      paddingHorizontal: 6,
    },
  });