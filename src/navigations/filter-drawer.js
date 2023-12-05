import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';

import Collection from '../pages/collection/CollectionPage';

import SortFilterPage from '../pages/filter/SortFilterPage';

import {NavBarDrawerHeader} from 'components';

import {Colors} from 'theme';

const FilterDrawer = createDrawerNavigator();

export const FilterDrawerNavigation = React.memo(() => {
  const styles = useSelector(state => state.navigationOptions.navigationStyles);

  return (
    <FilterDrawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'slide',
        swipeEnabled: false,
        title: 'All Items',
        headerTitleAlign: 'center',
      }}
      drawerContent={({navigation, state}) => (
        <SortFilterPage navigation={navigation} state={state} />
      )}>
      <FilterDrawer.Screen
        name="Collection"
        component={Collection}
        options={{
          header: (props) => <NavBarDrawerHeader {...props} />,
          headerTitleStyle: styles.textNavBarTitle,
          headerTintColor: Colors.lightBlue,
          headerShadowVisible: false
        }}
      />
    </FilterDrawer.Navigator>
  );
});

FilterDrawerNavigation.displayName = 'FilterDrawerNavigation';

