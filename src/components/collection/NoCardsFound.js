import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

import {createUseStyle} from 'theme';

const trayIcon = require('assets/icons/tray.png');

const NoCardsFound = ({style}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image source={trayIcon} style={styles.icon} />
      <Text style={styles.textNotFoundTitle}>No Cards Found</Text>
    </View>
  );
};

NoCardsFound.defaultProps = {};

NoCardsFound.propTypes = {};

export default NoCardsFound;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    tintColor: colors.grayText,
    marginBottom: 12,
  },
  textNotFoundTitle: {
    fontSize: 17,
    lineHeight: 28,
    fontWeight: 'bold',
    letterSpacing: -0.41,
    color: colors.darkGrayText,
  },
}));
