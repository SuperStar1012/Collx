import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import NotificationSplash from '../pages/notifications/NotificationSplash';
import IrregularUser from '../pages/auth/IrregularUser';

import {Maintenance, NetworkOffline} from 'components';

import {MainNavigation} from './main';
import {AuthNavigation} from './auth';
import {CommonNavigation} from './common';
import {OnboardingNavigation} from './onboarding';
import {CameraDrawerNavigation} from './camera-drawer';
import {CameraNavigation} from './camera';
import {CollXProNavigation} from './collx-pro';
import {SearchNavigation} from './search';
import {CardMessageNavigation} from './card-message';
import {ReportNavigation} from './report';
import {SellerToolsNavigation} from './seller-tools';

import VideoPlayer from '../pages/common/VideoPlayer';

const RootNativeStack = createNativeStackNavigator();

export const RootNavigation = React.memo(() => (
  <RootNativeStack.Navigator
    screenOptions={{
      headerShown: false,
      presentation: 'modal',
    }}>
    <RootNativeStack.Screen
      name="MainScreensStack"
      component={MainNavigation}
    />
    <RootNativeStack.Screen
      name="NotificationSplash"
      component={NotificationSplash}
    />
    <RootNativeStack.Screen
      name="NetworkOfflineModal"
      component={NetworkOffline}
      options={{
        gestureEnabled: false,
        presentation: 'transparentModal',
      }}
    />
    <RootNativeStack.Screen
      name="VideoPlayerModal"
      component={VideoPlayer}
      options={{
        presentation: 'transparentModal',
      }}
    />
    <RootNativeStack.Screen
      name="OnboardingModal"
      component={OnboardingNavigation}
    />
    <RootNativeStack.Screen
      name="MaintenanceModal"
      component={Maintenance}
      options={{
        gestureEnabled: false,
        presentation: 'fullScreenModal',
      }}
    />
    <RootNativeStack.Screen
      name="IrregularUserModal"
      component={IrregularUser}
      options={{
        headerShown: true,
        headerShadowVisible: false,
        presentation: 'fullScreenModal',
      }}
    />
    <RootNativeStack.Screen
      name="AuthStackModal"
      component={AuthNavigation}
      options={{
        gestureEnabled: false,
      }}
    />
    <RootNativeStack.Screen
      name="CameraStackModal"
      component={CameraNavigation}
      options={{
        gestureEnabled: false,
        presentation: 'fullScreenModal',
      }}
    />
    <RootNativeStack.Screen
      name="CameraDrawerStackModal"
      component={CameraDrawerNavigation}
    />
    <RootNativeStack.Screen
      name="SearchStackModal"
      component={SearchNavigation}
    />
    <RootNativeStack.Screen
      name="CardMessageStackModal"
      component={CardMessageNavigation}
    />
    <RootNativeStack.Screen
      name="CommonStackModal"
      component={CommonNavigation}
    />
    <RootNativeStack.Screen
      name="ReportStackModal"
      component={ReportNavigation}
    />
    <RootNativeStack.Screen
      name="CollXProStackModal"
      component={CollXProNavigation}
      options={{
        gestureEnabled: false,
        presentation: 'fullScreenModal',
      }}
    />
    <RootNativeStack.Screen
      name="SellerToolsStackModal"
      component={SellerToolsNavigation}
    />
  </RootNativeStack.Navigator>
));

RootNavigation.displayName = 'RootNavigation';
