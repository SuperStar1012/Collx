import React from 'react';
import {View, Text, Linking} from 'react-native';
import PropTypes from 'prop-types';

import Button from '../common/Button';

import {Colors, Fonts, createUseStyle} from 'theme';

const NetworkOffline = () => {
  const styles = useStyle();

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>You are offline</Text>
      <Text style={styles.textDescription}>
        Unable to connect to CollX servers. Please check your internet settings and try again.
      </Text>
      <Button
        style={styles.openSettingsButton}
        label="Open in Settings"
        labelStyle={styles.textOpenSettings}
        scale={Button.scaleSize.Two}
        onPress={handleOpenSettings}
      />
    </View>
  );
};

NetworkOffline.defaultProps = {
  isVisible: false,
};

NetworkOffline.propTypes = {
  isVisible: PropTypes.bool,
};

export default NetworkOffline;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.blackAlpha8,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: Colors.white,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
    textAlign: 'center',
    marginVertical: 12,
  },
  openSettingsButton: {
    width: 192,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 5,
  },
  textOpenSettings: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));
