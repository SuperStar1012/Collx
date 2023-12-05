import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Onboarding from '../pages/onboarding/Onboarding';

import Welcome from '../pages/auth/Welcome';
import CreateAccount from '../pages/auth/CreateAccount';
import EnterEmail from '../pages/auth/EnterEmail';
import SignUpPassword from '../pages/auth/SignUpPassword';
import SignUpName from '../pages/auth/SignUpName';
import SignUpAvatar from '../pages/auth/SignUpAvatar';
import SignInPassword from '../pages/auth/SignInPassword';
import SignInMagicLink from '../pages/auth/SignInMagicLink';
import ResetPassword from '../pages/auth/ResetPassword';
import ResetPasswordSuccess from '../pages/auth/ResetPasswordSuccess';
import SignUpReferralCode from '../pages/auth/SignUpReferralCode';

import Friends from '../pages/friend/Friends';
import FindFriends from '../pages/friend/FindFriends';

import ChangeUsernamePage from '../pages/change-username/ChangeUsernamePage';

import {getOnboarding} from 'utils';
import {createUseStyle} from 'theme';
import {Styles} from 'globals';

const AuthStack = createStackNavigator();

export const AuthNavigation = React.memo(({route}) => {
  const currentUser = useSelector(state => state.user.user);
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  const moreStyles = useStyle();

  const [isShownOnboarding, setIsShownOnboarding] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const isNeedName = currentUser?.id && !currentUser?.name;

  useEffect(() => {
    (async () => {
      // shown onboarding
      const showedOnboarding = await getOnboarding();
      if (showedOnboarding) {
        setIsShownOnboarding(true);
      } else {
        setIsShownOnboarding(false);
      }

      setIsInitialized(true);
    })();
  }, []);

  if (!isInitialized) {
    return <View style={moreStyles.container} />;
  }

  const headerStatusBarHeight = route?.name?.includes('Modal') ? Styles.headerStatusBarHeight : undefined;

  return (
    <AuthStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight,
      }}
      initialRouteName={
        isShownOnboarding
          ? isNeedName
            ? 'SignUpName'
            : 'Welcome'
          : 'Onboarding'
      }>
      <AuthStack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShadowVisible: false,
          title: '',
        }}
      />
      <AuthStack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{title: 'Create an Account'}}
      />
      <AuthStack.Screen
        name="EnterEmail"
        component={EnterEmail}
        options={{title: 'Get Started'}}
      />
      <AuthStack.Screen
        name="SignUpPassword"
        component={SignUpPassword}
        options={{title: 'Sign Up'}}
      />
      <AuthStack.Screen
        name="SignUpName"
        component={SignUpName}
        options={{title: 'Sign Up'}}
      />
      <AuthStack.Screen
        name="SignUpAvatar"
        component={SignUpAvatar}
        options={{title: 'Sign Up'}}
      />
      <AuthStack.Screen
        name="SignInPassword"
        component={SignInPassword}
        options={{title: 'Sign In'}}
      />
      <AuthStack.Screen
        name="SignInMagicLink"
        component={SignInMagicLink}
        options={{title: 'Sign In'}}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{title: 'Reset Password'}}
      />
      <AuthStack.Screen
        name="ResetPasswordSuccess"
        component={ResetPasswordSuccess}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="SignUpReferralCode"
        component={SignUpReferralCode}
        options={{title: 'Sign Up'}}
      />
      <AuthStack.Screen
        name="Friends"
        component={Friends}
        options={{title: null}}
      />
      <AuthStack.Screen
        name="FindFriends"
        component={FindFriends}
        options={{title: null}}
      />
      <AuthStack.Screen
        name="PickUsername"
        component={ChangeUsernamePage}
        options={{title: 'Sign Up'}}
      />
    </AuthStack.Navigator>
  );
});

AuthNavigation.displayName = 'AuthNavigation';

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
