import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {BottomTabNavigation} from './bottom-tab';

import CategorySelectPage from '../pages/category-select/CategorySelectPage';

const CategoryDrawer = createDrawerNavigator();

export const CategoryDrawerNavigation = React.memo(() => (
  <CategoryDrawer.Navigator
    screenOptions={{
      drawerPosition: 'left',
      drawerType: 'front',
      swipeEnabled: false,
      drawerStyle: {
        width: '88%',
      },
    }}
    drawerContent={({navigation, state}) => (
      <CategorySelectPage navigation={navigation} state={state} />
    )}>
    <CategoryDrawer.Screen
      name="BottomTabStackScreens"
      component={BottomTabNavigation}
      options={{
        headerShown: false,
      }}
    />
  </CategoryDrawer.Navigator>
));

CategoryDrawerNavigation.displayName = 'CategoryDrawerNavigation';

