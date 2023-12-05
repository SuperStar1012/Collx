import React from 'react';
import {
  StyleSheet,
  Platform,
} from 'react-native';

import Button from '../common/Button';

import {Colors} from 'theme';

const NavBarButton = props => {
  const {style, labelStyle, iconStyle} = props;

  return (
    <Button
      {...props}
      style={[styles.container, style]}
      labelStyle={[styles.textLabel, labelStyle]}
      iconStyle={[styles.iconNavBar, iconStyle]}
      badgeStyle={styles.badgeContainer}
    />
  );
};

NavBarButton.defaultProps = {};

NavBarButton.propTypes = {};

export default NavBarButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    top: Platform.OS === 'ios' ? 6 : 16,
    right: 14,
  },
  iconNavBar: {
    tintColor: Colors.lightBlue,
    resizeMode: 'contain',
    width: 28,
    height: 28,
  },
  textLabel: {
    color: Colors.lightBlue,
  },
});
