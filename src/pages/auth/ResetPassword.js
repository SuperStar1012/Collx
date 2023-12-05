import React, {useEffect, useState} from 'react';
import {TextInput, View, Text} from 'react-native';
import isEmail from 'validator/lib/isEmail';

import {
  Button,
  KeyboardAvoidingScrollView,
  EmailSuggestion,
} from 'components';

import {withUser} from 'store/containers';
import {Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {hp, correctEmailTypo} from 'utils';

const ResetPassword = ({
  navigation,
  route,
  resetPassword,
}) => {
  const {email: defaultEmail} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [email, setEmail] = useState(defaultEmail);
  const [correctEmail, setCorrectEmail] = useState('');

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Reset Password',
    });
  };

  const handleChangeText = (value) => {
    setEmail(value);
    setCorrectEmail('');
  };

  const handleNext = () => {
    const checkedEmail = correctEmailTypo(email);
    if (!correctEmail && email !== checkedEmail) {
      setCorrectEmail(checkedEmail);
      return;
    }

    resetPassword({
      email,
    });

    navigation.navigate('ResetPasswordSuccess', {email, isReset: true});
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView
        scrollEnabled={false}
        bottomOffset={Styles.screenSafeBottomHeight}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.textTitle}>Your email</Text>
          <Text style={styles.textDescription}>
            Enter the email address associated with your account. We’ll send you
            an email with instructions how to reset your password.
          </Text>
          <TextInput
            style={styles.textInputEmail}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Your email"
            placeholderTextColor={colors.placeholderText}
            keyboardType="email-address"
            value={email}
            underlineColorAndroid="transparent"
            onChangeText={handleChangeText}
          />
          <EmailSuggestion email={correctEmail} />
        </View>
        <Button
          style={[
            styles.nextButton,
            {marginBottom: Styles.screenSafeBottomHeight + 16},
          ]}
          labelStyle={styles.textNext}
          label="Next"
          scale={Button.scaleSize.One}
          disabled={!isEmail(email)}
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
  textInputEmail: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 16,
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

export default withUser(ResetPassword);
