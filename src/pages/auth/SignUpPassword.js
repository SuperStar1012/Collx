import React, {useEffect, useState} from 'react';
import {TextInput, View, Text} from 'react-native';

import {
  Button,
  KeyboardAvoidingScrollView,
  LoadingIndicator,
  ProgressStep,
} from 'components';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {hp} from 'utils';
import {usePrevious} from 'hooks';
import {withUser} from 'store/containers';
import {
  analyticsEvents,
  analyticsSendEvent,
  analyticsValues,
} from 'services';

const securePasswordIcon = require('assets/icons/eye.png');
const unsecurePasswordIcon = require('assets/icons/eye_slash.png');

const SignUpPassword = ({
  navigation,
  route,
  isFetching,
  isUpdatingUser,
  user,
  signIn,
  signUp,
  updateUser,
}) => {
  const {email, isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const prevProps = usePrevious({user});

  const [password, setPassword] = useState('');
  const [isSecureText, setIsSecureText] = useState(true);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (isAnonymousUser && prevProps.user?.anonymous && !user?.anonymous) {
      signIn({
        email,
        password,
      });
    } else if (!prevProps.user?.id && user?.id) {
      navigation.navigate('SignUpName', {isAnonymousUser});
    }
  }, [user]);

  const handleNext = () => {
    if (isAnonymousUser) {
      updateUser({
        anonymous: false,
        email,
        password,
      });
      return;
    }

    signUp({
      email,
      password,
    });

    // Custom Analytics
    analyticsSendEvent(
      analyticsEvents.startedRegistration,
      {
        auth_method: analyticsValues.email,
      },
    );
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching || isUpdatingUser} />
      <ProgressStep currentStep={2} totalSteps={Constants.authProgressSteps} />
      <KeyboardAvoidingScrollView
        scrollEnabled={false}
        bottomOffset={Styles.screenSafeBottomHeight}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.textTitle}>Create a password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.textInputPassword}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor={colors.placeholderText}
              secureTextEntry={isSecureText}
              value={password}
              underlineColorAndroid="transparent"
              onChangeText={setPassword}
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
        </View>
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
    marginTop: hp(13),
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
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
}));

export default withUser(SignUpPassword);
