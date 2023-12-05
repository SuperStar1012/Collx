import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import CheckoutPage from '../pages/checkout/CheckoutPage';

import ApplyPricePage from '../pages/checkout/ApplyPricePage';

import OrderDetailPage from '../pages/order-detail/OrderDetailPage';
import AddTrackingCodePage from '../pages/order-detail/AddTrackingCodePage';

import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/edit-profile/EditProfilePage';
import FollowingThemPage from '../pages/following-them/FollowingThemPage';
import TheyFollowingPage from '../pages/they-following/TheyFollowingPage';
import ChatPage from '../pages/messages/ChatPage';

import {CollectionNavigation} from './collection';
import {CardDetailNavigation} from './card-detail';
import {MessageNavigation} from './message';
import {ReferralNavigation} from './referral';
import {DealNavigation} from './deal';
import {OrderNavigation} from './order';
import {SellerToolsNavigation} from './seller-tools';
import {CollXProNavigation} from './collx-pro';
import {PaymentMethodNavigation} from './payment-method';
import {ShippingAddressNavigation} from './shipping-address';
import {MyMoneyNavigation} from './my-money';

const CheckoutStack = createStackNavigator();

export const CheckoutNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CheckoutStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShadowVisible: false,
      }}>
      <CheckoutStack.Screen
        name="Checkout"
        component={CheckoutPage}
        options={{
          title: 'Checkout',
          headerShadowVisible: false,
        }}
      />
      <CheckoutStack.Screen
        name="OrderDetail"
        component={OrderDetailPage}
        options={{
          title: 'Order Detail',
          headerShadowVisible: false,
        }}
      />
      <CheckoutStack.Screen
        name="ApplyPrice"
        component={ApplyPricePage}
        options={{
          title: 'Apply',
        }}
      />
      <CheckoutStack.Screen
        name="AddTrackingCode"
        component={AddTrackingCodePage}
        options={{
          title: '',
        }}
      />
      <CheckoutStack.Screen
        name="PaymentMethodScreens"
        component={PaymentMethodNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="ShippingAddressScreens"
        component={ShippingAddressNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <CheckoutStack.Screen
        name="EditProfile"
        component={EditProfilePage}
        options={{title: 'Edit Profile Info'}}
      />
      <CheckoutStack.Screen
        name="FollowingThem"
        component={FollowingThemPage}
        options={{title: 'Followers'}}
      />
      <CheckoutStack.Screen
        name="TheyFollowing"
        component={TheyFollowingPage}
        options={{title: 'Following'}}
      />
      <CheckoutStack.Screen
        name="CollectionStackScreens"
        component={CollectionNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="CardDetailStackScreens"
        component={CardDetailNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="MessageScreens"
        component={MessageNavigation}
        options={{
          headerTitleAlign: 'left',
          headerShown: false,
        }}
      />
      <CheckoutStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
      <CheckoutStack.Screen
        name="ReferralProgramStackScreens"
        component={ReferralNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="DealsScreens"
        component={DealNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="OrderScreens"
        component={OrderNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="SellerToolsScreens"
        component={SellerToolsNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="CollXProScreens"
        component={CollXProNavigation}
        options={{headerShown: false}}
      />
      <CheckoutStack.Screen
        name="MyMoneyScreens"
        component={MyMoneyNavigation}
        options={{headerShown: false}}
      />
    </CheckoutStack.Navigator>
  );
});

CheckoutNavigation.displayName = 'CheckoutNavigation';
