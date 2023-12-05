import React, {useEffect, useState} from 'react';
import {TextInput, View, Text} from 'react-native';

import {Button, LoadingIndicator, KeyboardAvoidingScrollView} from 'components';
import ErrorText from './components/ErrorText';

import {Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {hp} from 'utils';
import {usePrevious} from 'hooks';
import {withUser} from 'store/containers';

const securePasswordIcon = require('assets/icons/eye.png');
const unsecurePasswordIcon = require('assets/icons/eye_slash.png');

const SignInPassword = ({
  navigation,
  route,
  isFetching,
  user,
  errorText,
  signIn,
}) => {
  const {email, isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const prevProps = usePrevious({user, errorText});

  const [password, setPassword] = useState('');
  const [isSecureText, setIsSecureText] = useState(true);
  const [isShowError, setIsShowError] = useState(false);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (!prevProps.user?.id && user?.id) {
      if (!user?.name) {
        navigation.navigate('SignUpName', {isAnonymousUser});
        return;
      }
    }
  }, [user]);

  useEffect(() => {
    if (
      prevProps &&
      prevProps.errorText &&
      !prevProps.errorText.signIn &&
      errorText.signIn
    ) {
      setIsShowError(true);
    }
  }, [errorText.signIn]);

  const handleChangePassword = text => {
    setPassword(text);
    setIsShowError(false);
  };

  // const handleSignInLink = () => {
  //   navigation.navigate('SignInMagicLink', {email});
  // };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPassword', {
      email,
    });
  };

  const handleNext = () => {
    signIn({
      email,
      password,
    });
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching} />
      <KeyboardAvoidingScrollView
        scrollEnabled={false}
        bottomOffset={Styles.screenSafeBottomHeight}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.textTitle}>What is your password?</Text>
          <Text style={styles.textDescription}>
            We detected you have an account. You can log in with your password
            or a sign in link sent to your email address.
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.textInputPassword,
                {color: isShowError ? Colors.red : colors.primaryText},
              ]}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry={isSecureText}
              value={password}
              underlineColorAndroid="transparent"
              onChangeText={handleChangePassword}
            />
            <Button
              style={styles.securePasswordButton}
              labelStyle={styles.textSecurePassword}
              label={isSecureText ? 'Show' : 'Hide'}
              iconStyle={styles.iconSecurePassword}
              icon={isSecureText ? securePasswordIcon : unsecurePasswordIcon}
              scale={Button.scaleSize.One}
              onPress={() => setIsSecureText(!isSecureText)}
            />
          </View>
          <View style={styles.otherActionsContainer}>
            {/* <Button
              labelStyle={styles.textOtherButton}
              label="Use sign in link"
              scale={Button.scaleSize.Two}
              onPress={() => handleSignInLink()}
            /> */}
            <Button
              labelStyle={styles.textOtherButton}
              label="Forgot password?"
              scale={Button.scaleSize.Two}
              onPress={() => handleForgotPassword()}
            />
          </View>
        </View>
        <ErrorText
          style={styles.textError}
          visible={isShowError}
          errorMessage="The password entered does not match our record."
        />
        <Button
          style={[
            styles.nextButton,
            {marginBottom: Styles.screenSafeBottomHeight + 16},
          ]}
          labelStyle={styles.textNext}
          label="Next"
          scale={Button.scaleSize.One}
          disabled={!password}
          activeColor={Colors.white}
          inactiveColor={colors.lightGrayText}
          activeBackgroundColor={colors.primary}
          inactiveBackgroundColor={colors.secondaryCardBackground}
          onPress={() => handleNext()}
        />
      </KeyboardAvoidingScrollView>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: hp(10),
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginTop: 12,
  },
  passwordContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 16,
  },
  textInputPassword: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
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
  otherActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  textOtherButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  nextButton: {
    height: 48,
    borderRadius: 10,
    margin: 16,
  },
  textNext: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  textError: {
    marginHorizontal: 16,
  },
}));

export default withUser(SignInPassword);
