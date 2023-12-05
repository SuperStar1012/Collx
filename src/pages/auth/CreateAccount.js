import React, {useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Platform,
} from 'react-native';
import {StackActions, CommonActions} from '@react-navigation/native';
import Config from 'react-native-config';

import {NavBarButton, Button, LoadingIndicator} from 'components';

import {Constants, Urls} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {withUser} from 'store/containers';
import {
  logInWithApple,
  logInWithFacebook,
  logInWithGoogle,
  getStorageItem,
  showAlert,
} from 'utils';
import {usePrevious} from 'hooks';
import ActionContext, {useActions} from 'actions';

const appleIcon = require('assets/icons/social/apple.png');
const facebookIcon = require('assets/icons/social/facebook.png');
const googleIcon = require('assets/icons/social/google.png');
const closeIcon = require('assets/icons/close.png');
const checkIcon = require('assets/icons/check.png');

const explainItems = [
  'Share your collection publicly and receive likes and comments from the community.',
  'Customize your profile, follow other collectors, and build a following on CollX.',
  'Follow, message, comment on, and buy cards from other CollX users.',
  'Back up your collection and sync across multiple devices.',
];

const CreateAccount = props => {
  const {
    navigation,
    route,
    isAuthenticated,
    isCompletedSignUp,
    isFetching,
    isUpdatingUser,
    user,
    lookedupSocial,
    lookUpSocial,
    updateUser,
    signIn,
  } = props;

  const variant = route.params?.variant || Constants.createAccountVariant.continue;

  const styles = useStyle();

  const prevProps = usePrevious({user});
  const actions = useActions();

  const socialInfoRef = useRef({});
  const isCheckedExistingEmail = useRef(false);

  useEffect(() => {
    setNavigationBar();
  }, []);

  useEffect(() => {
    if (Object.keys(socialInfoRef.current).length && prevProps && prevProps.user?.anonymous && !user?.anonymous) {
      signIn(socialInfoRef.current);
      return;
    }

    if (isAuthenticated && !isCompletedSignUp && user?.id && !user.anonymous) {
      navigation.dispatch(StackActions.popToTop());
      handleClose();

      actions.updateProfileInLocal(user);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainHomeStackScreens'}],
        }),
      );
    }
  }, [user?.id, user?.anonymous, isAuthenticated, isCompletedSignUp]);

  useEffect(() => {
    if (!lookedupSocial) {
      return;
    }

    if (lookedupSocial.exists) {
      // signIn(socialInfoRef.current);
      showAlert(
        'Account already exists',
        `A user already exists for this ${socialInfoRef.current.appleId || socialInfoRef.current.facebookId || socialInfoRef.current.googleId}`,
      );
    } else {
      // signUp(socialInfoRef.current);
      updateUser({
        anonymous: false,
        ...socialInfoRef.current,
      });
    }
  }, [lookedupSocial]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Create an Account',
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
    });
  };

  const getDescription = () => {
    if (variant === Constants.createAccountVariant.create) {
      return 'Create a free CollX account to:';
    } else if (variant === Constants.createAccountVariant.continue) {
      return 'To continue, you must sign in. \nCreate a free CollX account to:';
    }
    return '';
  };

  const lookUpSocialUser = async () => {
    const oldEmail = await getStorageItem(Constants.lastLoggedInUserEmail);
    const email = socialInfoRef.current.email;

    const isCheckExistingAccount = Config.CHECK_EXISTING_ACCOUNT_ON_DEVICE === 'true';

    if (!isCheckExistingAccount || !oldEmail || oldEmail === email || isCheckedExistingEmail.current) {
      lookUpSocial(socialInfoRef.current);
      return;
    }

    let socialName = '';
    if (socialInfoRef.current.appleId) {
      socialName = 'Apple';
    } else if (socialInfoRef.current.facebookId) {
      socialName = 'Facebook';
    } else if (socialInfoRef.current.googleId) {
      socialName = 'Google';
    }

    isCheckedExistingEmail.current = true;

    showAlert(
      'Existing Account on Device',
      `This device was used to register a CollX account using the ${socialName} ID ${email}. Please log in with that account.`,
    );
  };

  const handleClose = () => {
    navigation.goBack();
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

      if (socialInfoRef.current.email) {
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
    navigation.navigate('EnterEmail', {isAnonymousUser: true});
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

  const renderExplain = () => {
    return (
      <View style={styles.explainContainer}>
        {explainItems.map((item, index) => (
          <View key={index} style={styles.explainItem}>
            <Image style={styles.iconCheck} source={checkIcon} />
            <Text style={styles.textExplain}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderAgreement = () => {
    return (
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
  };

  const renderBottomContent = () => {
    return (
      <View style={styles.bottomContainer}>
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.textOr}>OR</Text>
          <View style={styles.orLine} />
        </View>
        <Button
          style={styles.signUpButton}
          labelStyle={styles.textSignUp}
          label="Sign Up with email"
          scale={Button.scaleSize.Four}
          onPress={handleSignInWithEmail}
        />
      </View>
    );
  };

  return (
    <ActionContext.Provider value={actions}>
      <ScrollView style={styles.container}>
        <LoadingIndicator isLoading={isFetching || isUpdatingUser} />
        <Text style={styles.textTitle}>{getDescription()}</Text>
        {renderExplain()}
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
        {renderBottomContent()}
      </ScrollView>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryBackground,
  },
  textTitle: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.darkGrayText,
    marginTop: 16,
    textAlign: 'center',
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  explainContainer: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 16,
    backgroundColor: colors.secondaryCardBackground,
  },
  explainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  textExplain: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  iconCheck: {
    width: 14,
    height: 14,
    tintColor: Colors.lightGreen,
    marginRight: 8,
  },
  agreementContainer: {
    marginVertical: 16,
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
    marginVertical: 5,
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
  bottomContainer: {
    alignItems: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
  signUpButton: {},
  textSignUp: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
}));

export default withUser(CreateAccount);
