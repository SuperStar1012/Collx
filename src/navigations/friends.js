import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import ProfilePage from '../pages/profile/ProfilePage';
import FollowingThemPage from '../pages/following-them/FollowingThemPage';
import TheyFollowingPage from '../pages/they-following/TheyFollowingPage';

import Friends from '../pages/friend/Friends';
import FindFriends from '../pages/friend/FindFriends';

import {CollectionNavigation} from './collection';

const FriendsStack = createStackNavigator();

export const FriendsNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <FriendsStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShadowVisible: false,
      }}>
      <FriendsStack.Screen
        name="Friends"
        component={Friends}
        options={{title: null}}
      />
      <FriendsStack.Screen
        name="FindFriends"
        component={FindFriends}
        options={{title: null}}
      />
      <FriendsStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
        }}
      />
      <FriendsStack.Screen
        name="FollowingThem"
        component={FollowingThemPage}
        options={{title: 'Followers'}}
      />
      <FriendsStack.Screen
        name="TheyFollowing"
        component={TheyFollowingPage}
        options={{title: 'Following'}}
      />
      <FriendsStack.Screen
        name="CollectionStackScreens"
        component={CollectionNavigation}
        options={{headerShown: false}}
      />
    </FriendsStack.Navigator>
  );
});

FriendsNavigation.displayName = 'FriendsNavigation';
