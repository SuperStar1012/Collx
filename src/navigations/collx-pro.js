import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import GetCollXProPage from '../pages/get-collx-pro/GetCollXProPage';
import ExportCollectionPage from '../pages/export-collection/ExportCollectionPage';
import ExportCollectionProgressPage from '../pages/export-collection/ExportCollectionProgressPage';

const CollXProStack = createStackNavigator();

export const CollXProNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CollXProStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <CollXProStack.Screen
        name="GetCollXPro"
        component={GetCollXProPage}
        options={{
          title: 'Get CollX Pro',
          headerShadowVisible: false,
        }}
      />
      <CollXProStack.Screen
        name="ExportCollection"
        component={ExportCollectionPage}
        options={{
          title: 'ExportCollection',
        }}
      />
      <CollXProStack.Screen
        name="ExportCollectionProgress"
        component={ExportCollectionProgressPage}
        options={{
          title: 'ExportCollection',
        }}
      />
    </CollXProStack.Navigator>
  );
});

CollXProNavigation.displayName = 'CollXProNavigation';
