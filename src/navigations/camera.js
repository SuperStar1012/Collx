import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import Camera from '../pages/camera/CameraPage';
import CaptureResult from '../pages/camera-result/CameraResultPage';

import {SearchNavigation} from './search';

const CameraStack = createStackNavigator();

export const CameraNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CameraStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <CameraStack.Screen
        name="Camera"
        component={Camera}
        options={{
          headerShown: false,
        }}
      />
      <CameraStack.Screen
        name="CaptureResult"
        component={CaptureResult}
        options={{
          title: 'Scan Results',
        }}
      />
      <CameraStack.Screen
        name="SearchStackScreens"
        component={SearchNavigation}
        options={{headerShown: false}}
      />
    </CameraStack.Navigator>
  );
});

CameraNavigation.displayName = 'CameraNavigation';
