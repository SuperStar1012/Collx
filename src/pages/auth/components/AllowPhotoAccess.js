import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {openSettings} from 'react-native-permissions';

import {Button} from 'components';

import {Fonts, createUseStyle} from 'theme';

const AllowPhotoAccess = props => {
  const {style, requestPermission} = props;

  const styles = useStyle();

  const handleOpenSettings = () => {
    openSettings().catch(() => console.log('cannot open settings'));
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>Allow {requestPermission} Access</Text>
      <Text style={styles.textDescription}>
        {`To upload your own avatar, you’ll need to allow ${requestPermission} access in Settings.`}
      </Text>
      <Button
        style={styles.openSettingsButton}
        label="Open Settings"
        labelStyle={styles.textOpenSetting}
        scale={Button.scaleSize.Two}
        onPress={() => handleOpenSettings()}
      />
    </View>
  );
};

AllowPhotoAccess.defaultProps = {
  requestPermission: null,
};

AllowPhotoAccess.propTypes = {
  requestPermission: PropTypes.string,
};

export default AllowPhotoAccess;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 16,
    backgroundColor: colors.primaryBackground,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.primaryText,
    marginBottom: 16,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginBottom: 24,
  },
  openSettingsButton: {
    width: 167,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  textOpenSetting: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
}));
