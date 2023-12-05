import React, {useEffect, useState, useRef} from 'react';
import {TextInput, View, Text} from 'react-native';
import isEmail from 'validator/lib/isEmail';
import Config from 'react-native-config';

import {
  Button,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  EmailSuggestion,
} from 'components';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {hp, getStorageItem, correctEmailTypo, showAlert} from 'utils';
import {withUser} from 'store/containers';

const EnterEmail = ({
  navigation,
  route,
  isFetching,
  lookup,
  lookUp,
}) => {
  const {isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [email, setEmail] = useState('');
  const [correctEmail, setCorrectEmail] = useState('');

  const isCheckedExistingEmail = useRef(false);

  useEffect(() => {
    if (!email) {
      return;
    }

    if (lookup && lookup.exists) {
      if (isAnonymousUser) {
        showAlert('Account already exists', `A user already exists for this ${email}`);
        return;
      }

      navigation.navigate('SignInPassword', {
        email,
        isAnonymousUser,
      });
    } else if (lookup && !lookup.exists) {
      navigation.navigate('SignUpPassword', {
        email,
        isAnonymousUser,
      });
    }
  }, [lookup]);

  const handleChangeText = (value) => {
    setEmail(value);
    setCorrectEmail('');
  };

  const handleNext = async () => {
    const oldEmail = await getStorageItem(Constants.lastLoggedInUserEmail);

    const isCheckExistingAccount = Config.CHECK_EXISTING_ACCOUNT_ON_DEVICE === 'true';

    if (!isCheckExistingAccount || !oldEmail || oldEmail === email || isCheckedExistingEmail.current) {
      const checkedEmail = correctEmailTypo(email);
      if (!correctEmail && email !== checkedEmail) {
        setCorrectEmail(checkedEmail);
        return;
      }

      lookUp({email});
      return;
    }

    isCheckedExistingEmail.current = true;

    showAlert(
      'Existing Account on Device',
      `This device was used to register a CollX account using the email address ${oldEmail}. Please log in with that address.`,
    );
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
          <Text style={styles.textTitle}>What is your email?</Text>
          <Text style={styles.textDescription}>
            Enter your email address to get started. If you have an account,
            you’ll be asked for a password.
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

export default withUser(EnterEmail);
