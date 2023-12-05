import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import SellerToolsPage from '../pages/seller-tools/SellerToolsPage';
import AcceptOffersPage from '../pages/seller-tools/AcceptOffersPage';
import SellerDiscountPage from '../pages/seller-tools/SellerDiscountPage';
import SellerMinimumPage from '../pages/seller-tools/SellerMinimumPage';
import SellerMinimumAmountEditPage from '../pages/seller-tools/SellerMinimumAmountEditPage';
import ShippingSettingsPage from '../pages/seller-tools/ShippingSettingsPage';
import TaxpayerInformationPage from '../pages/seller-tools/TaxpayerInformationPage';
import NameAndAddressPage from '../pages/seller-tools/NameAndAddressPage';
import AddSsnTinPage from '../pages/seller-tools/AddSsnTinPage';
import SetSellerSettingsPage from '../pages/seller-tools/SetSellerSettingsPage';

import {ShippingAddressNavigation} from './shipping-address';

import {Styles} from 'globals';

const SellerToolsStack = createStackNavigator();

export const SellerToolsNavigation = React.memo(({route}) => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  const headerStatusBarHeight = route?.name?.includes('Modal') ? Styles.headerStatusBarHeight : undefined;

  return (
    <SellerToolsStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight,
      }}>
      <SellerToolsStack.Screen
        name="SellerTools"
        component={SellerToolsPage}
        options={{
          title: 'Seller Tools',
        }}
      />
      <SellerToolsStack.Screen
        name="AcceptOffers"
        component={AcceptOffersPage}
        options={{
          title: 'Accept Offers',
        }}
      />
      <SellerToolsStack.Screen
        name="SellerDiscount"
        component={SellerDiscountPage}
        options={{
          title: 'Seller Discount',
        }}
      />
      <SellerToolsStack.Screen
        name="SellerMinimum"
        component={SellerMinimumPage}
        options={{
          title: 'Seller Minimum',
        }}
      />
      <SellerToolsStack.Screen
        name="SellerMinimumAmountEdit"
        component={SellerMinimumAmountEditPage}
        options={{
          title: 'Minimum Amount',
        }}
      />
      <SellerToolsStack.Screen
        name="ShippingSettings"
        component={ShippingSettingsPage}
        options={{
          title: 'Shipping Settings',
        }}
      />
      <SellerToolsStack.Screen
        name="TaxpayerInformation"
        component={TaxpayerInformationPage}
        options={{
          title: 'Taxpayer Information',
        }}
      />
      <SellerToolsStack.Screen
        name="NameAndAddress"
        component={NameAndAddressPage}
        options={{
          title: 'Name And Address',
        }}
      />
      <SellerToolsStack.Screen
        name="AddSsnTin"
        component={AddSsnTinPage}
        options={{
          title: 'Add SSN/TIN',
        }}
      />
      <SellerToolsStack.Screen
        name="SetSellerSettings"
        component={SetSellerSettingsPage}
        options={{
          title: 'Set Seller Settings',
        }}
      />
      <SellerToolsStack.Screen
        name="ShippingAddressModal"
        component={ShippingAddressNavigation}
        options={{headerShown: false}}
      />
    </SellerToolsStack.Navigator>
  );
});

SellerToolsNavigation.displayName = 'SellerToolsNavigation';
