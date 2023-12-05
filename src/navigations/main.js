import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import {AuthNavigation} from './auth';
import {FriendsNavigation} from './friends';
import {CheckoutNavigation} from './checkout';
import {CategoryDrawerNavigation} from './category-drawer';

const MainStack = createStackNavigator();

export const MainNavigation = React.memo(() => {
  const currentUser = useSelector(state => state.user.user);
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  const isLoggedIn = currentUser?.token && (currentUser.name || currentUser.anonymous);

  return (
    <MainStack.Navigator
      initialRouteName={
        isLoggedIn ? 'MainHomeStackScreens' : 'AuthStackScreens'
      }
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}>
      <MainStack.Screen
        name="AuthStackScreens"
        component={AuthNavigation}
      />
      <MainStack.Screen
        name="MainHomeStackScreens"
        component={CategoryDrawerNavigation}
      />
      <MainStack.Screen
        name="FriendsStackScreens"
        component={FriendsNavigation}
      />
      <MainStack.Screen
        name="CheckoutScreens"
        component={CheckoutNavigation}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
});

MainNavigation.displayName = 'MainNavigation';
