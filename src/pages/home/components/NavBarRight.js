import React from 'react';
import {View} from 'react-native';

import {
  NavBarButton,
} from 'components';

import {createUseStyle} from 'theme';
import {wp} from 'utils';

const notificationIcon = require('assets/icons/bell.png');
const personSearchIcon = require('assets/icons/person_circle_search.png');

const NavBarRight = ({
  unreadCount = 0,
  onNotifications,
  onSearchUsers,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.actionsContainer}>
      <NavBarButton
        style={styles.navBarButton}
        icon={personSearchIcon}
        onPress={onSearchUsers}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={notificationIcon}
        badge={unreadCount > 0}
        onPress={onNotifications}
      />
    </View>
);
};

export default NavBarRight;

const useStyle = createUseStyle(() => ({
  actionsContainer: {
    // height: 36,
    width: wp(22),
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBarButton: {},
}));
