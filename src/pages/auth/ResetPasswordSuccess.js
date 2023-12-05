import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import {openInbox} from 'react-native-email-link';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';
import {hp} from 'utils';

const checkCircleIcon = require('assets/icons/more/check_circle_outline.png');

const ResetPasswordSuccess = ({
  navigation,
  route,
}) => {
  const {email, isReset} = route.params || {};

  const styles = useStyle();

  const handleOpenEmailApp = () => {
    try {
      openInbox();
    } catch (error) {
      console.log(error);
    }

    navigation.navigate('EnterEmail');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderDescription = () => {
    if (isReset) {
      return (
        <Text style={styles.textDescription}>
          {'We just sent an email to '}
          <Text style={styles.textDescriptionBold}>{email}</Text>. It has
          instructions on resetting your password.
        </Text>
      );
    }

    return (
      <Text style={styles.textDescription}>
        {'To sign in, tap the button in the email we sent to '}
        <Text style={styles.textDescriptionBold}>{email}</Text>.
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Image style={styles.iconCheck} source={checkCircleIcon} />
      <Text style={styles.textTitle}>Sent! Check your email.</Text>
      {renderDescription()}
      <Button
        style={styles.openButton}
        labelStyle={styles.textOpen}
        label="Open Email App"
        scale={Button.scaleSize.One}
        onPress={() => handleOpenEmailApp()}
      />
      <Button
        style={styles.goBackButton}
        labelStyle={styles.textGoBack}
        label="Go back"
        scale={Button.scaleSize.One}
        onPress={() => handleGoBack()}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: hp(14),
    backgroundColor: colors.primaryBackground,
  },
  iconCheck: {
    width: 100,
    height: 100,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
    marginTop: 21,
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
  openButton: {
    width: 175,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 24,
  },
  textOpen: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
  goBackButton: {
    marginTop: 20,
  },
  textGoBack: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
}));

export default ResetPasswordSuccess;
