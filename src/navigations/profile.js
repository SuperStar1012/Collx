import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import SettingsPage from '../pages/settings/SettingsPage';
import AppearanceAndSound from '../pages/more-settings/AppearanceAndSound';
import DarkModeSettings from '../pages/more-settings/DarkModeSettings';
import CameraSoundEffectSettings from '../pages/more-settings/CameraSoundEffectSettings';
import AccountSettings from '../pages/account-settings/AccountSettingsPage';
import EditProfilePage from '../pages/edit-profile/EditProfilePage';
import ChangePassword from '../pages/more-settings/ChangePassword';
import PrivacySettings from '../pages/more-settings/PrivacySettings';
import AboutCollX from '../pages/more-settings/AboutCollX';

import ChangeUsernamePage from '../pages/change-username/ChangeUsernamePage';

import NotificationSettings from '../pages/more-settings/notification/NotificationSettings';
import NewsSettings from '../pages/more-settings/notification/NewsSettings';
import FollowersSettings from '../pages/more-settings/notification/FollowersSettings';
import CommentsAndLikesSettings from '../pages/more-settings/notification/CommentsAndLikesSettings';
import MessagesSettings from '../pages/more-settings/notification/MessagesSettings';
import PortfolioChangeSettings from '../pages/more-settings/notification/PortfolioChangeSettings';
import WinnersSettings from '../pages/more-settings/notification/WinnersSettings';

import ProfilePage from '../pages/profile/ProfilePage';
import FollowingThemPage from '../pages/following-them/FollowingThemPage';
import TheyFollowingPage from '../pages/they-following/TheyFollowingPage';
import ChatPage from '../pages/messages/ChatPage';
import MyLikesPage from '../pages/collection/MyLikesPage';

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

const ProfileStack = createStackNavigator();

export const ProfileNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <ProfileStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsPage}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfilePage}
        options={{title: 'Edit Profile Info'}}
      />
      <ProfileStack.Screen
        name="ChangeUsername"
        component={ChangeUsernamePage}
        options={{title: 'Change Username'}}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{title: 'Change Password'}}
      />
      <ProfileStack.Screen
        name="PrivacySettings"
        component={PrivacySettings}
        options={{title: 'Privacy Settings'}}
      />
      <ProfileStack.Screen
        name="FollowingThem"
        component={FollowingThemPage}
        options={{title: 'Followers'}}
      />
      <ProfileStack.Screen
        name="TheyFollowing"
        component={TheyFollowingPage}
        options={{title: 'Following'}}
      />
      <ProfileStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{title: 'Notification Settings'}}
      />
      <ProfileStack.Screen
        name="NewsSettings"
        component={NewsSettings}
        options={{title: 'News'}}
      />
      <ProfileStack.Screen
        name="FollowersSettings"
        component={FollowersSettings}
        options={{title: 'Followers'}}
      />
      <ProfileStack.Screen
        name="CommentsAndLikesSettings"
        component={CommentsAndLikesSettings}
        options={{title: 'Comments and Likes'}}
      />
      <ProfileStack.Screen
        name="MessagesSettings"
        component={MessagesSettings}
        options={{title: 'Messages'}}
      />
      <ProfileStack.Screen
        name="PortfolioChangeSettings"
        component={PortfolioChangeSettings}
        options={{title: 'Portfolio Change'}}
      />
      <ProfileStack.Screen
        name="WinnersSettings"
        component={WinnersSettings}
      />
      <ProfileStack.Screen
        name="DarkModeSettings"
        component={DarkModeSettings}
        options={{title: 'Dark Mode'}}
      />
      <ProfileStack.Screen
        name="AppearanceAndSound"
        component={AppearanceAndSound}
        options={{
          title: 'Appearance & Sound',
        }}
      />
      <ProfileStack.Screen
        name="CameraSoundEffectSettings"
        component={CameraSoundEffectSettings}
        options={{
          title: 'Camera Sound Effects',
        }}
      />
      <ProfileStack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          title: 'Account Settings',
        }}
      />
      <ProfileStack.Screen
        name="AboutCollX"
        component={AboutCollX}
        options={{
          title: 'About CollX',
        }}
      />
      <ProfileStack.Screen
        name="CollectionStackScreens"
        component={CollectionNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="CardDetailStackScreens"
        component={CardDetailNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="MessageScreens"
        component={MessageNavigation}
        options={{
          headerTitleAlign: 'left',
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
      <ProfileStack.Screen
        name="MyLikesScreen"
        component={MyLikesPage}
        options={{title: 'My Likes'}}
      />
      <ProfileStack.Screen
        name="ReferralProgramStackScreens"
        component={ReferralNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="DealsScreens"
        component={DealNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="OrderScreens"
        component={OrderNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="SellerToolsScreens"
        component={SellerToolsNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="CollXProScreens"
        component={CollXProNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="PaymentMethodScreens"
        component={PaymentMethodNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="ShippingAddressScreens"
        component={ShippingAddressNavigation}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="MyMoneyScreens"
        component={MyMoneyNavigation}
        options={{headerShown: false}}
      />
    </ProfileStack.Navigator>
  );
});

ProfileNavigation.displayName = 'ProfileNavigation';

