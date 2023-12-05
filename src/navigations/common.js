import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import WebViewer from '../pages/common/WebViewer';

import {Styles} from 'globals';

const CommonStack = createStackNavigator();

export const CommonNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CommonStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight: Styles.headerStatusBarHeight,
      }}>
      <CommonStack.Screen
        name="WebViewer"
        component={WebViewer}
        options={{title: null}}
      />
    </CommonStack.Navigator>
  );
});

CommonNavigation.displayName = 'CommonNavigation';
