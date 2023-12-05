import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {openSettings, RESULTS} from 'react-native-permissions';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {requestContactsPermission} from 'utils';

const AllowContactsAccess = props => {
  const {
    style,
    permission,
    isAllowAccess,
    onChangePermission,
    onPrivacyPolicy,
  } = props;

  const styles = useStyle();

  const handleOpenSettings = () => {
    openSettings().catch(() => console.log('cannot open settings'));
  };

  const handlePrivacyPolicy = () => {
    if (onPrivacyPolicy) {
      onPrivacyPolicy();
    }
  };

  const handleAllowAccess = () => {
    requestContactsPermission().then(result => {
      onChangePermission(result);
    });
  };

  if (permission === RESULTS.GRANTED) {
    return null;
  }

  const renderDescription = () => {
    if (permission !== RESULTS.DENIED || isAllowAccess) {
      return (
        <Text style={[styles.textDescription, styles.textGrantDescription]}>
          Grant CollX access to your contacts to see suggested referrals. Your
          contacts will only be used to help you connect with friends.
        </Text>
      );
    }

    return (
      <Text style={[styles.textDescription, styles.textSyncDescription]}>
        {
          'Sync your contacts to easily find people you know on CollX. Your contacts will only be used to help you connect with friends. Learn more in our '
        }
        <Text style={styles.textPrivacyPolicy} onPress={handlePrivacyPolicy}>
          Privacy Policy
        </Text>
        .
      </Text>
    );
  };

  const renderButton = () => {
    if (permission === RESULTS.DENIED) {
      if (isAllowAccess) {
        return (
          <Button
            style={[styles.button, styles.allowAccessButton]}
            label="Allow Access"
            labelStyle={[styles.textButton, styles.textAllowAccess]}
            scale={Button.scaleSize.Two}
            onPress={handleAllowAccess}
          />
        );
      }

      return (
        <Button
          style={styles.button}
          label="Continue"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.Two}
          onPress={handleAllowAccess}
        />
      );
    }

    return (
      <Button
        style={styles.button}
        label="Open Settings"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.Two}
        onPress={handleOpenSettings}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>Allow contacts access</Text>
      {renderDescription()}
      {renderButton()}
    </View>
  );
};

AllowContactsAccess.defaultProps = {
  permission: RESULTS.UNAVAILABLE,
  isAllowAccess: false,
  onChangePermission: () => {},
  onPrivacyPolicy: () => {},
};

AllowContactsAccess.propTypes = {
  permission: PropTypes.string,
  isAllowAccess: PropTypes.bool,
  onChangePermission: PropTypes.func,
  onPrivacyPolicy: PropTypes.func,
};

export default AllowContactsAccess;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: colors.secondaryCardBackground,
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
  textGrantDescription: {
    color: colors.darkGrayText,
  },
  textSyncDescription: {
    color: colors.darkGrayText,
  },
  textPrivacyPolicy: {
    color: colors.primary,
  },
  button: {
    width: 167,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  allowAccessButton: {
    backgroundColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
  textAllowAccess: {
    color: Colors.white,
  },
}));
