import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import MyPurchasesPage from '../pages/my-purchases-sales/MyPurchasesPage';
import MySalesPage from '../pages/my-purchases-sales/MySalesPage';

import OrderDetailPage from '../pages/order-detail/OrderDetailPage';
import AddTrackingCodePage from '../pages/order-detail/AddTrackingCodePage';

const OrderStack = createStackNavigator();

export const OrderNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <OrderStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <OrderStack.Screen
        name="MyPurchases"
        component={MyPurchasesPage}
        options={{
          title: 'My Purchases',
          headerShadowVisible: false,
        }}
      />
      <OrderStack.Screen
        name="MySales"
        component={MySalesPage}
        options={{
          title: 'My Sales',
          headerShadowVisible: false,
        }}
      />
      <OrderStack.Screen
        name="OrderDetail"
        component={OrderDetailPage}
        options={{
          title: 'Order Detail',
          headerShadowVisible: false,
        }}
      />
      <OrderStack.Screen
        name="AddTrackingCode"
        component={AddTrackingCodePage}
        options={{
          title: '',
        }}
      />
    </OrderStack.Navigator>
  );
});

OrderNavigation.displayName = 'OrderNavigation';
