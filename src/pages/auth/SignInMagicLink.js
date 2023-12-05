import React from 'react';
import {View, Text} from 'react-native';

import {Button, LoadingIndicator} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {hp} from 'utils';
import {withUser} from 'store/containers';

const SignInMagicLink = ({
  navigation,
  route,
  isFetching,
  createLink,
}) => {
  const {email} = route.params || {};

  const styles = useStyle();

  const handleSignInWithPassword = () => {
    navigation.goBack();
  };

  const handleSendSignInLink = () => {
    createLink({
      email,
    });
    navigation.navigate('ResetPasswordSuccess', {email, isReset: false});
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching} />
      <Text style={styles.textTitle}>Send me a magic link</Text>
      <Text style={styles.textDescription}>
        {'Get a link to your email '}
        <Text style={styles.textDescriptionBold}>{email}</Text>
        {' that will sign you in instantly!'}
      </Text>
      <Button
        style={styles.sendButton}
        labelStyle={styles.textSend}
        label="Send sign in link"
        scale={Button.scaleSize.One}
        onPress={() => handleSendSignInLink()}
      />
      <Button
        style={styles.signInButton}
        labelStyle={styles.textSignIn}
        label="Sign in with password instead"
        scale={Button.scaleSize.Two}
        onPress={() => handleSignInWithPassword()}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: hp(12),
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
    textAlign: 'center',
    marginTop: 12,
  },
  textDescriptionBold: {
    fontWeight: Fonts.bold,
  },
  sendButton: {
    width: 175,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 24,
  },
  textSend: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
  signInButton: {
    marginTop: 24,
  },
  textSignIn: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));

export default withUser(SignInMagicLink);
