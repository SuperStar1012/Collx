import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import CameraDrawerPage from '../pages/camera-drawer/CameraDrawerPage';
import TradingCardOwnersPage from '../pages/trading-card-owners/TradingCardOwnersPage';
import ChatPage from '../pages/messages/ChatPage';

import {SearchNavigation} from './search';

import {Styles} from 'globals';

const CameraDrawerStack = createStackNavigator();

export const CameraDrawerNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CameraDrawerStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShadowVisible: false,
        headerStatusBarHeight: Styles.headerStatusBarHeight,
      }}>
      <CameraDrawerStack.Screen
        name="CameraDrawer"
        component={CameraDrawerPage}
        options={{title: null}}
      />
      <CameraDrawerStack.Screen
        name="CardUsers"
        component={TradingCardOwnersPage}
        options={{title: 'Users With This Card'}}
      />
      <CameraDrawerStack.Screen
        name="SearchStackScreens"
        component={SearchNavigation}
        options={{headerShown: false}}
      />
      <CameraDrawerStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
    </CameraDrawerStack.Navigator>
  );
});

CameraDrawerNavigation.displayName = 'CameraDrawerNavigation';
