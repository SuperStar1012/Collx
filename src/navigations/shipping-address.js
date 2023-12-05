import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import AddEditShippingAddressPage from '../pages/shipping-address/AddEditShippingAddressPage';
import SelectShippingAddressPage from '../pages/shipping-address/SelectShippingAddressPage';

const ShippingAddressStack = createStackNavigator();

import {Styles} from 'globals';

export const ShippingAddressNavigation = React.memo(({route}) => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  const headerStatusBarHeight = route?.name?.includes('Modal') ? Styles.headerStatusBarHeight : undefined;

  return (
    <ShippingAddressStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight
      }}>
      <ShippingAddressStack.Screen
        name="SelectShippingAddress"
        component={SelectShippingAddressPage}
        options={{
          title: 'My Shipping Address',
        }}
      />
      <ShippingAddressStack.Screen
        name="AddEditShippingAddress"
        component={AddEditShippingAddressPage}
        options={{
          title: 'Shipping Info',
        }}
      />
    </ShippingAddressStack.Navigator>
  );
});

ShippingAddressNavigation.displayName = 'ShippingAddressNavigation';
