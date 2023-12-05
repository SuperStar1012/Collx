import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Platform,
  Image,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Config from 'react-native-config';
import _ from 'lodash';

import {Button, LoadingIndicator} from 'components';

import {Constants, Styles, Urls} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {withUser} from 'store/containers';
import {
  logInWithApple,
  logInWithFacebook,
  logInWithGoogle,
  getStorageItem,
  showAlert,
} from 'utils';
import {
  analyticsEvents,
  analyticsSendEvent,
  analyticsValues,
} from 'services';

const appleIcon = require('assets/icons/social/apple.png');
const facebookIcon = require('assets/icons/social/facebook.png');
const googleIcon = require('assets/icons/social/google.png');

const Welcome = props => {
  const {
    navigation,
    isAuthenticated,
    isCompletedSignUp,
    isFetching,
    user,
    lookedupSocial,
    lookUpSocial,
    signIn,
    signUp,
  } = props;

  const {t: {icons}} = useTheme();
  const styles = useStyle();

  const socialInfoRef = useRef({});
  const isCheckedExistingEmail = useRef(false);

  useEffect(() => {
    setNavigationBar();
  }, []);

  useEffect(() => {
    if (user?.id && isAuthenticated && !isCompletedSignUp) {

      // Custom Analytics
      const socialName = getSocialName();
      if (socialInfoRef.current && socialName) {
        analyticsSendEvent(
          analyticsEvents.completedRegistration,
          {
            auth_method: socialName,
            name: socialInfoRef.current.name,
            email: socialInfoRef.current.email,
          },
        );
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainHomeStackScreens'}],
        }),
      );
    }
  }, [user?.id, isAuthenticated, isCompletedSignUp]);

  useEffect(() => {
    if (!Object.keys(socialInfoRef.current).length) {
      return;
    }

    if (lookedupSocial && lookedupSocial.exists) {
      signIn(socialInfoRef.current);
    } else if (lookedupSocial && !lookedupSocial.exists) {
      signUp(socialInfoRef.current);

      // Custom Analytics
      const socialName = getSocialName();
      if (socialName) {
        analyticsSendEvent(
          analyticsEvents.startedRegistration,
          {
            auth_method: socialName,
          },
        );
      }
    }
  }, [lookedupSocial]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerTitle: () => <Image style={styles.iconLogo} source={icons.logo} />,
    });
  };

  const getSocialName = () => {
    let socialName = '';
    if (socialInfoRef.current.appleId) {
      socialName = analyticsValues.apple;
    } else if (socialInfoRef.current.facebookId) {
      socialName = analyticsValues.facebook;
    } else if (socialInfoRef.current.googleId) {
      socialName = analyticsValues.google;
    }

    return socialName;
  };

  const lookUpSocialUser = async () => {
    const email = socialInfoRef.current.email;
    const oldEmail = await getStorageItem(Constants.lastLoggedInUserEmail);

    const isCheckExistingAccount = Config.CHECK_EXISTING_ACCOUNT_ON_DEVICE === 'true';

    if (!isCheckExistingAccount || !oldEmail || oldEmail === email || isCheckedExistingEmail.current) {
      lookUpSocial(socialInfoRef.current);
      return;
    }

    isCheckedExistingEmail.current = true;
    const socialName = _.capitalize(getSocialName());

    showAlert(
      'Existing Account on Device',
      `This device was used to register a CollX account using the ${socialName} ID ${email}. Please log in with that account.`,
    );
  };

  const handleApple = async () => {
    logInWithApple(values => {
      socialInfoRef.current = values;

      if (socialInfoRef.current.email) {
        lookUpSocialUser();
      }
    });
  };

  const handleFacebook = () => {
    logInWithFacebook(values => {
      socialInfoRef.current = values;

      if (socialInfoRef.current.facebookId) {
        lookUpSocialUser();
      }
    });
  };

  const handleGoogle = async () => {
    logInWithGoogle(values => {
      socialInfoRef.current = values;

      if (socialInfoRef.current.email) {
        lookUpSocialUser();
      }
    });
  };

  const handleSignInWithEmail = () => {
    // signUp({anonymous: true});

    navigation.navigate('EnterEmail', {isAnonymousUser: false});
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('CommonStackModal', {
      screen: 'WebViewer',
      params: {
        title: 'Privacy Policy',
        url: Urls.privacyUrl,
      },
    });
  };

  const handleUserAgreement = () => {
    navigation.navigate('CommonStackModal', {
      screen: 'WebViewer',
      params: {
        title: 'User Agreement',
        url: Urls.termsUrl,
      },
    });
  };

  const renderTopContent = () => (
    <View style={styles.topContainer}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.textWelcome}>Welcome to CollX!</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.textDescription}>
          A place to quickly scan, digitize, and transact collectibles.
        </Text>
      </View>
    </View>
  );

  const renderAgreement = () => (
    <View style={styles.agreementContainer}>
      <View style={styles.agreement}>
        <Text style={styles.textAgreement}>
          {'By continuing, you agree to CollX’s'}
        </Text>
      </View>
      <View style={styles.agreement}>
        <Text style={styles.textAgreementLink} onPress={handlePrivacyPolicy}>
          Privacy Policy
        </Text>
        <Text style={styles.textAgreement}> and </Text>
        <Text style={styles.textAgreementLink} onPress={handleUserAgreement}>
          User Agreement
        </Text>
        <Text style={styles.textAgreement}>.</Text>
      </View>
    </View>
  );

  const renderDiver = () => (
    <View style={styles.orContainer}>
      <View style={styles.orLine} />
      <Text style={styles.textOr}>OR</Text>
      <View style={styles.orLine} />
    </View>
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching} />
      {renderTopContent()}
      {renderAgreement()}
      {Platform.OS === 'ios' ? (
        <Button
          style={[styles.socialButton, styles.appleButton]}
          iconStyle={styles.iconApple}
          icon={appleIcon}
          labelStyle={[styles.textSocial, styles.textApple]}
          label="Sign in with Apple"
          scale={Button.scaleSize.One}
          onPress={handleApple}
        />
      ) : null}
      <Button
        style={[styles.socialButton, styles.facebookButton]}
        iconStyle={styles.iconFacebook}
        icon={facebookIcon}
        labelStyle={styles.textSocial}
        label="Sign in with Facebook"
        scale={Button.scaleSize.One}
        onPress={handleFacebook}
      />
      <Button
        style={[styles.socialButton, styles.googleButton]}
        iconStyle={styles.iconGoogle}
        icon={googleIcon}
        labelStyle={styles.textSocial}
        label="Sign in with Google"
        scale={Button.scaleSize.One}
        onPress={handleGoogle}
      />
      {renderDiver()}
      <Button
        style={[styles.getStartedButton, {marginBottom: Styles.screenSafeBottomHeight + 20}]}
        labelStyle={styles.textGetStarted}
        label="Log In or Sign Up with Email"
        scale={Button.scaleSize.One}
        onPress={handleSignInWithEmail}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryBackground,
  },
  iconLogo: {
    width: 110,
    height: 30,
    resizeMode: 'contain',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textWelcome: {
    fontWeight: Fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.34,
    color: colors.primaryText,
  },
  descriptionContainer: {
    flex: 1.5,
    marginTop: 12,
  },
  textDescription: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
  agreementContainer: {
    marginBottom: 16,
  },
  agreement: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  textAgreement: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
  textAgreementLink: {
    textDecorationLine: 'underline',
    color: colors.primary,
  },
  socialButton: {
    height: 48,
    borderRadius: 10,
    marginVertical: 12,
  },
  appleButton: {
    backgroundColor: colors.appleButtonBackground,
  },
  iconApple: {
    width: 19,
    height: 23,
    resizeMode: 'contain',
    tintColor: colors.appleButtonText,
  },
  facebookButton: {
    backgroundColor: Colors.darkBlue,
  },
  iconFacebook: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  googleButton: {
    backgroundColor: Colors.darkRed,
  },
  iconGoogle: {
    width: 27,
    height: 17,
    resizeMode: 'contain',
  },
  textSocial: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: Colors.white,
    marginLeft: 16,
  },
  textApple: {
    color: colors.appleButtonText,
  },
  orContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGrayText,
  },
  textOr: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginHorizontal: 16,
  },
  getStartedButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  textGetStarted: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: Colors.white,
  },
}));

export default withUser(Welcome);
