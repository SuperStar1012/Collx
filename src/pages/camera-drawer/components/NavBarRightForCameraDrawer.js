import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavBarButton} from 'components';

const shareIcon = require('assets/icons/share.png');
const removeIcon = require('assets/icons/trash.png');
const ellipsisIcon = require('assets/icons/ellipsis.png');

const NavBarRightForCameraDrawer = ({
  onShareUrl,
  onRemoveCard,
  onShowMoreActions,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <NavBarButton
        style={styles.navBarButton}
        icon={shareIcon}
        onPress={onShareUrl}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={removeIcon}
        onPress={onRemoveCard}
      />
      <NavBarButton
        style={styles.navBarButton}
        icon={ellipsisIcon}
        onPress={onShowMoreActions}
      />
    </View>
  );
};

export default NavBarRightForCameraDrawer;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    navBarButton: {
      flex: 0,
      width: 28,
      height: 28,
      marginHorizontal: 5,
    },
  });