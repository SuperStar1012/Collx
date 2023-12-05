import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import ProfilePage from '../pages/profile/ProfilePage';
import ViewFullSetPage from '../pages/view-full-set/ViewFullSetPage';
import ChatPage from '../pages/messages/ChatPage';

import {FilterDrawerNavigation} from './filter-drawer';
import {CardDetailNavigation} from './card-detail';

const CollectionStack = createStackNavigator();

export const CollectionNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CollectionStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <CollectionStack.Screen
        name="CollectionFilterDrawer"
        component={FilterDrawerNavigation}
        options={{
          title: null,
          headerShown: false,
        }}
      />
      <CollectionStack.Screen
        name="CardDetailStackScreens"
        component={CardDetailNavigation}
        options={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <CollectionStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <CollectionStack.Screen
        name="ViewFullSet"
        component={ViewFullSetPage}
        options={{
          title: "View Full Set",
          headerShadowVisible: false,
        }}
      />
      <CollectionStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
    </CollectionStack.Navigator>
  );
});

CollectionNavigation.displayName = 'CollectionNavigation';
