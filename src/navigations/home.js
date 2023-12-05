import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import HomePage from '../pages/home/HomePage';
import FeaturedUsersPage from '../pages/featured-users/FeaturedUsersPage';

import ChatPage from '../pages/messages/ChatPage';

import NotificationsPage from '../pages/notifications/NotificationsPage';

import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/edit-profile/EditProfilePage';
import FollowingThemPage from '../pages/following-them/FollowingThemPage';
import TheyFollowingPage from '../pages/they-following/TheyFollowingPage';

import {SearchNavigation} from './search';
import {CollectionNavigation} from './collection';
import {CardDetailNavigation} from './card-detail';
import {ReferralNavigation} from './referral';
import {DealNavigation} from './deal';
import {OrderNavigation} from './order';
import {MyMoneyNavigation} from './my-money';

const HomeStack = createStackNavigator();

export const HomeNavigation = React.memo(() => {
  // const styles = useSelector(state => state.navigationOptions.navigationStyles);
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <HomeStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShadowVisible: false,
          // headerStyle: styles.homeHeaderContainer,
        }}
      />
      <HomeStack.Screen
        name="AllFeaturedUsers"
        component={FeaturedUsersPage}
        options={{
          title: 'Featured Users',
        }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsPage}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <HomeStack.Screen
        name="EditProfile"
        component={EditProfilePage}
        options={{title: 'Edit Profile Info'}}
      />
      <HomeStack.Screen
        name="FollowingThem"
        component={FollowingThemPage}
        options={{title: 'Followers'}}
      />
      <HomeStack.Screen
        name="TheyFollowing"
        component={TheyFollowingPage}
        options={{title: 'Following'}}
      />
      <HomeStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
      <HomeStack.Screen
        name="CollectionStackScreens"
        component={CollectionNavigation}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="CardDetailStackScreens"
        component={CardDetailNavigation}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="SearchStackScreens"
        component={SearchNavigation}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <HomeStack.Screen
        name="ReferralProgramStackScreens"
        component={ReferralNavigation}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="DealsScreens"
        component={DealNavigation}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="OrderScreens"
        component={OrderNavigation}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="MyMoneyScreens"
        component={MyMoneyNavigation}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
});

HomeNavigation.displayName = 'HomeNavigation';
