import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import AddPaymentCardPage from '../pages/payment-method/AddPaymentCardPage';
import SelectPaymentMethodPage from '../pages/payment-method/SelectPaymentMethodPage';

import {wp} from 'utils';

const PaymentMethodStack = createStackNavigator();

export const PaymentMethodNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <PaymentMethodStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <PaymentMethodStack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethodPage}
        options={{
          title: 'My Payment Methods',
        }}
      />
      <PaymentMethodStack.Screen
        name="AddPaymentCard"
        component={AddPaymentCardPage}
        options={{
          headerTitleStyle: {
            ...screenOptions.headerTitleStyle,
            fontSize: wp(4.6),
          },
          title: 'Add CollX Credit/Debit Card',
        }}
      />
    </PaymentMethodStack.Navigator>
  );
});

PaymentMethodNavigation.displayName = 'PaymentMethodNavigation';
