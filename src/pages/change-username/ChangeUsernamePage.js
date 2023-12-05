import React, {useCallback, useEffect, useState, Suspense, useRef, useMemo} from 'react';
import {TextInput, View, Text} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import _ from 'lodash';

import {
  Button,
  NavBarButton,
  KeyboardAvoidingScrollView,
  ProgressStep,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {showErrorAlert} from 'utils';
import {getUserProfile} from 'store/relay';

const defaultUsernameRegex = /^user[0-9]+/;
const validUsernameRegex = /^[a-zA-Z0-9]+$/;
const minLength = 3;
const maxLength = 30;

const ChangeUsernamePage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions(prev => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              {...props}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({navigation, route, queryOptions}) => {
  const {isSignUp, isAnonymousUser} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const debouncedCheckFunc = useRef(null);

  const viewerData = useLazyLoadQuery(graphql`
    query ChangeUsernamePageQuery {
      viewer {
        profile {
          id
          username
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(viewerData.viewer.profile.username);
  const [errorMessage, setErrorMessage] = useState(null);

  const isDisabled = useMemo(() => (
    (currentUsername?.length < minLength || currentUsername?.length > maxLength) || !!errorMessage
  ), [currentUsername, errorMessage]);

  useEffect(() => {
    if (!isSignUp) {
      setNavigationBar();
    }
  }, [currentUsername, errorMessage, isDisabled]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={handleCancel}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          disabled={isDisabled}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangeUsername = value => {
    setCurrentUsername(value);

    if (defaultUsernameRegex.test(value)) {
      setErrorMessage('That username is not available');
      return;
    } else if (!validUsernameRegex.test(value) || value.length < minLength) {
      setErrorMessage('Your username must be between 3-30 characters, and made up of alphanumeric characters (A–Z, a–z, 0–9)');
      return;
    } else {
      setErrorMessage(null);
    }

    if (debouncedCheckFunc.current) {
      debouncedCheckFunc.current.cancel();
    }

    debouncedCheckFunc.current = _.debounce(async () => {
      debouncedCheckFunc.current = null;
      try {
        const profile = await getUserProfile(value);
        if (profile) {
          setErrorMessage('That username is already taken');
        }
      } catch (error) {
        console.log(error);
      }
    },
    500,
    {
      leading: false,
      trailing: true,
    });

    debouncedCheckFunc.current();
  };

  const handleSave = () => {
    setIsUpdating(true);

    actions.updateUsername(
      currentUsername,
      {
        onComplete: () => {
          setIsUpdating(false);

          if (isSignUp) {
            navigation.navigate('SignUpAvatar', {isAnonymousUser});
          } else {
            handleCancel();
          }
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error.message) {
            showErrorAlert(error.message);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdating} />
      {isSignUp ? <ProgressStep currentStep={4} totalSteps={Constants.authProgressSteps} /> : null}
      <KeyboardAvoidingScrollView
        scrollEnabled={false}
        bottomOffset={Styles.screenSafeBottomHeight}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {isSignUp ? (
            <>
              <Text style={styles.textTitle}>Pick a username</Text>
              <Text style={styles.textDescription}>Username is unique to each user and can be used by others to find you and connect with you.</Text>
            </>
          ) : (
            <Text style={styles.textUsername}>Username</Text>
          )}
          <TextInput
            style={[styles.textInputPassword, errorMessage ? styles.textInputInvalidPassword : {}]}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Username"
            placeholderTextColor={colors.placeholderText}
            value={currentUsername}
            maxLength={maxLength}
            underlineColorAndroid="transparent"
            onChangeText={handleChangeUsername}
          />
          {errorMessage ? (
            <Text style={styles.textErrorMessage}>{errorMessage}</Text>
          ) : null}
        </View>
        {isSignUp ? (
          <Button
            style={[
              styles.nextButton,
              {marginBottom: Styles.screenSafeBottomHeight + 16},
            ]}
            labelStyle={styles.textNext}
            label="Next"
            scale={Button.scaleSize.One}
            disabled={isDisabled}
            activeColor={Colors.white}
            inactiveColor={colors.lightGrayText}
            activeBackgroundColor={colors.primary}
            inactiveBackgroundColor={colors.secondaryCardBackground}
            onPress={handleSave}
          />
        ) : null}
      </KeyboardAvoidingScrollView>
    </View>
  );
};

export default ChangeUsernamePage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 16,
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
  textUsername: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
    marginTop: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
  textInputPassword: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInputInvalidPassword: {
    borderWidth: 1,
    borderColor: Colors.red,
  },
  textErrorMessage: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.red,
    marginTop: 8,
  },
  nextButton: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  textNext: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
  },
}));
