import React, {useEffect, useRef, useState} from 'react';
import {TextInput, View, Text} from 'react-native';

import {
  Button,
  NavBarButton,
  KeyboardAvoidingScrollView,
  LoadingIndicator,
} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {showErrorAlert} from 'utils';
import {withProfile} from 'store/containers';

const securePasswordIcon = require('assets/icons/eye.png');
const unsecurePasswordIcon = require('assets/icons/eye_slash.png');

const ChangePassword = props => {
  const {navigation, user, isFetching, updatePassword} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const isSubmit = useRef(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [isCurrentPasswordSecure, setIsCurrentPasswordSecure] = useState(true);
  const [isNewPasswordSecure, setIsNewPasswordSecure] = useState(true);
  const [isNewConfirmPasswordSecure, setIsNewConfirmPasswordSecure] =
    useState(true);

  useEffect(() => {
    setNavigationBar();
    isSubmit.current = false;
  }, [currentPassword, newPassword, newConfirmPassword]);

  useEffect(() => {
    if (isSubmit.current && user.password === newPassword) {
      handleCancel();
    }
  }, [newPassword, user]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Change Password',
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={() => handleCancel()}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          onPress={() => handleSave()}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    if (!currentPassword || user.password !== currentPassword) {
      showErrorAlert('Wrong password');
      return;
    }

    if (!newPassword || !newConfirmPassword) {
      showErrorAlert('Wrong new password');
      return;
    }

    if (newPassword !== newConfirmPassword) {
      showErrorAlert('Wrong new confirm password');
      return;
    }

    if (user.password === newPassword) {
      handleCancel();
      return;
    }

    isSubmit.current = true;

    updatePassword(newPassword);
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching} />
      <KeyboardAvoidingScrollView>
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Current Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.textInputPassword}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry={isCurrentPasswordSecure}
              value={currentPassword}
              underlineColorAndroid="transparent"
              onChangeText={setCurrentPassword}
            />
            <Button
              style={styles.securePasswordButton}
              labelStyle={styles.textSecurePassword}
              label={isCurrentPasswordSecure ? 'Show' : 'Hide'}
              iconStyle={styles.iconSecurePassword}
              icon={
                isCurrentPasswordSecure
                  ? securePasswordIcon
                  : unsecurePasswordIcon
              }
              scale={Button.scaleSize.One}
              onPress={() =>
                setIsCurrentPasswordSecure(!isCurrentPasswordSecure)
              }
            />
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.textInputPassword}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry={isNewPasswordSecure}
              value={newPassword}
              underlineColorAndroid="transparent"
              onChangeText={setNewPassword}
            />
            <Button
              style={styles.securePasswordButton}
              labelStyle={styles.textSecurePassword}
              label={isNewPasswordSecure ? 'Show' : 'Hide'}
              iconStyle={styles.iconSecurePassword}
              icon={
                isNewPasswordSecure ? securePasswordIcon : unsecurePasswordIcon
              }
              scale={Button.scaleSize.One}
              onPress={() => setIsNewPasswordSecure(!isNewPasswordSecure)}
            />
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.textFieldName}>Confirm New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.textInputPassword}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry={isNewConfirmPasswordSecure}
              value={newConfirmPassword}
              underlineColorAndroid="transparent"
              onChangeText={setNewConfirmPassword}
            />
            <Button
              style={styles.securePasswordButton}
              labelStyle={styles.textSecurePassword}
              label={isNewConfirmPasswordSecure ? 'Show' : 'Hide'}
              iconStyle={styles.iconSecurePassword}
              icon={
                isNewConfirmPasswordSecure
                  ? securePasswordIcon
                  : unsecurePasswordIcon
              }
              scale={Button.scaleSize.One}
              onPress={() =>
                setIsNewConfirmPasswordSecure(!isNewConfirmPasswordSecure)
              }
            />
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 16,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  itemContainer: {
    marginVertical: 12,
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
  },
  passwordContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 12,
  },
  textInputPassword: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  securePasswordButton: {
    width: 76,
    justifyContent: 'flex-start',
  },
  textSecurePassword: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginLeft: 8,
  },
  iconSecurePassword: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.darkGrayText,
  },
}));

export default withProfile(ChangePassword);
