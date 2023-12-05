import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

import {Button, ProgressStep} from 'components';
import FriendAvatar from './components/FriendAvatar';

import {Constants, Styles, Urls} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {requestContactsPermission} from 'utils';

const Friends = ({navigation, route}) => {
  const {
    isSignUp,
    referral,
    isAnonymousUser
  } = route.params || {};

  const styles = useStyle();

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: isSignUp ? 'Sign Up' : 'Find Your Friends',
    });
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

  const handleNotNow = () => {
    navigation.navigate('FindFriends', {
      isSignUp,
      isAnonymousUser,
    });
  };

  const handleContinue = () => {
    requestContactsPermission().then(() => {
      handleNotNow();
    });
  };

  const renderProgressBar = () => {
    if (!isSignUp) {
      return null;
    }

    return (
      <>
        <ProgressStep
          currentStep={6}
          totalSteps={Constants.authProgressSteps}
        />
        <Text style={styles.textTitle}>Find your Friends</Text>
      </>
    );
  };

  const renderDescription = () => {
    let description = 'See which of your contacts are \nalready on CollX.';

    if (referral) {
      description = `You’re now following ${referral.name}, who invited you to CollX. See who else in your contacts is already on CollX.`;
    }

    return <Text style={styles.textDescription}>{description}</Text>;
  };

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      {renderDescription()}
      <View style={styles.centerContainer}>
        <FriendAvatar avatarUrl={referral?.avatarImageUrl} />
        <Text style={styles.textDescription}>
          {
            'Sync your contacts to easily find people you know on CollX. Your contacts will only be used to help you connect with friends. Learn more in our '
          }
          <Text style={styles.textPrivacyPolicy} onPress={handlePrivacyPolicy}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
      <View
        style={{
          marginBottom:
            Styles.screenSafeBottomHeight +
            styles.actionsContainer.marginBottom,
        }}>
        <Button
          style={styles.button}
          label="Not Now"
          labelStyle={styles.textButton}
          scale={Button.scaleSize.One}
          onPress={handleNotNow}
        />
        <Button
          style={[styles.button, styles.continueButton]}
          label="Continue"
          labelStyle={[styles.textButton, styles.textContinue]}
          scale={Button.scaleSize.One}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    paddingHorizontal: 16,
  },
  textTitle: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    fontWeight: Fonts.semiBold,
    textAlign: 'center',
    marginTop: 55,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 10,
  },
  textPrivacyPolicy: {
    color: colors.primary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  button: {
    height: 48,
    borderRadius: 10,
    marginVertical: 5,
  },
  continueButton: {
    backgroundColor: colors.primary,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    color: colors.primary,
  },
  textContinue: {
    color: Colors.white,
  },
}));

export default Friends;
