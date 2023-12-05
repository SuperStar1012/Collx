import React, {useEffect, useState} from 'react';
import {TextInput, View, Text, Keyboard} from 'react-native';

import {
  Button,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  ProgressStep,
} from 'components';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {hp} from 'utils';
import {usePrevious} from 'hooks';
import {withUser} from 'store/containers';
import {setStorageItem} from 'utils';

const SignUpName = ({
  navigation,
  route,
  isFetching,
  isUpdatingUser,
  user,
  updateUser,
}) => {
  const {isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const prevProps = usePrevious({user, isUpdatingUser});

  const [name, setName] = useState('');

  useEffect(() => {
    setNavigationBar();
  }, []);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if ((!prevProps.user?.name && user?.name) || (user?.name && !prevProps.isUpdatingUser && isUpdatingUser)) {
      navigation.navigate('PickUsername', {isSignUp: true, isAnonymousUser});
      setStorageItem(Constants.showedIntroduceUsername, 'true');
    }
  }, [user, isUpdatingUser]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  };

  const handleNext = () => {
    if (name?.trim()) {
      Keyboard.dismiss();
      updateUser({name: name?.trim()});
    }
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching || isUpdatingUser} />
      <ProgressStep currentStep={3} totalSteps={Constants.authProgressSteps} />
      <KeyboardAvoidingScrollView
        scrollEnabled={false}
        bottomOffset={Styles.screenSafeBottomHeight}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.textTitle}>What’s your name?</Text>
          <TextInput
            style={styles.textInputName}
            autoFocus
            autoCorrect={false}
            autoCapitalize="words"
            placeholder="Full name"
            placeholderTextColor={colors.placeholderText}
            value={name}
            maxLength={Constants.nameMaxLength}
            underlineColorAndroid="transparent"
            onChangeText={setName}
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
          disabled={!name?.trim()}
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
  textInputName: {
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

export default withUser(SignUpName);
