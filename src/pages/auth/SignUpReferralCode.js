import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  Keyboard,
} from 'react-native';

import {
  Button,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  ProgressStep,
} from 'components';
import ErrorText from './components/ErrorText';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {usePrevious} from 'hooks';
import {withUser} from 'store/containers';
import {hp} from 'utils';

const SignUpReferralCode = ({
  navigation,
  route,
  isFetching,
  isFetchingReferral,
  newReferral,
  referralErrorText,
  setReferral,
}) => {
  const {isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const prevProps = usePrevious({newReferral});

  const [isShowError, setIsShowError] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (!prevProps.newReferral && newReferral) {
      navigateToFriends(newReferral);
    }
  }, [newReferral]);

  useEffect(() => {
    if (!referralErrorText) {
      return;
    }

    setIsShowError(true);
  }, [referralErrorText]);

  const navigateToFriends = (referral = null) => {
    navigation.navigate('Friends', {
      isSignUp: true,
      isAnonymousUser,
      referral,
    });
  };

  const handleChangeReferralCode = value => {
    setIsShowError(false);
    setReferralCode(value);
  };

  const handleNext = () => {
    Keyboard.dismiss();

    if (referralCode) {
      setReferral(referralCode);
      return;
    }

    navigateToFriends();
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching || isFetchingReferral} />
      <ProgressStep currentStep={6} totalSteps={Constants.authProgressSteps} />
      <KeyboardAvoidingScrollView bottomOffset={Styles.screenSafeBottomHeight}>
        <View style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.textTitle}>
              Got a referral code?.
            </Text>
            <Text style={[styles.textTitle, styles.textOptional]}>
              (optional)
            </Text>
          </View>
          <Text style={styles.textDescription}>
            When you scan a card, you and your friend will both earn progress toward a free pack of cards.
          </Text>
          <TextInput
            style={styles.textReferralCode}
            autoCorrect={false}
            placeholder="Referral code"
            placeholderTextColor={colors.placeholderText}
            value={referralCode}
            underlineColorAndroid="transparent"
            onChangeText={handleChangeReferralCode}
          />
          <ErrorText
            style={styles.textError}
            visible={isShowError}
            errorMessage="Please enter a valid referral code."
          />
        </View>
        <Button
          style={[
            styles.nextButton,
            {marginBottom: Styles.screenSafeBottomHeight + 16},
          ]}
          labelStyle={styles.textNext}
          label="Next"
          scale={Button.scaleSize.One}
          activeColor={Colors.white}
          inactiveColor={colors.lightGrayText}
          activeBackgroundColor={colors.primary}
          inactiveBackgroundColor={colors.secondaryCardBackground}
          onPress={handleNext}
        />
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
  mainContainer: {
    flex: 1,
    marginTop: hp(10),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  textOptional: {
    color: colors.grayText,
    marginHorizontal: 6,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginTop: 12,
  },
  textReferralCode: {
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
    marginBottom: 12,
  },
  nextButton: {
    height: 48,
    borderRadius: 10,
    marginVertical: 12,
  },
  textNext: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
  },
  textError: {
    marginTop: 12,
  },
}));

export default withUser(SignUpReferralCode);
