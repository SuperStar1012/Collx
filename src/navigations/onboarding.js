import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import {Styles} from 'globals';

import DealOnboardingPage from '../pages/card-detail/DealOnboardingPage';

const OnboardingStack = createStackNavigator();

export const OnboardingNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <OnboardingStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight: Styles.headerStatusBarHeight,
        headerShadowVisible: false,
      }}>
      <OnboardingStack.Screen
        name="DealOnboarding"
        component={DealOnboardingPage}
        options={{
          title: 'Try Deals',
        }}
      />
    </OnboardingStack.Navigator>
  );
});

OnboardingNavigation.displayName = 'OnboardingNavigation';
