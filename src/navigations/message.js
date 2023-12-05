import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import MessagesPage from '../pages/messages/MessagesPage';
import ChatPage from '../pages/messages/ChatPage';
import ChatThreadPage from '../pages/messages/ChatThreadPage';

import ProfilePage from '../pages/profile/ProfilePage';
import EditProfilePage from '../pages/edit-profile/EditProfilePage';
import FollowingThemPage from '../pages/following-them/FollowingThemPage';
import TheyFollowingPage from '../pages/they-following/TheyFollowingPage';
import WebViewer from '../pages/common/WebViewer';

import {CollectionNavigation} from './collection';
import {CardDetailNavigation} from './card-detail';
import {DealNavigation} from './deal';

const MessagesStack = createStackNavigator();

export const MessageNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <MessagesStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <MessagesStack.Screen name="Messages" component={MessagesPage} />
      <MessagesStack.Screen
        name="Message"
        component={ChatPage}
        options={{
          headerTitleAlign: 'left',
          title: null,
        }}
      />
      <MessagesStack.Screen
        name="ChatThread"
        component={ChatThreadPage}
        options={{
          title: 'Thread Reply',
        }}
      />
      <MessagesStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          title: null,
          headerShadowVisible: false,
        }}
      />
      <MessagesStack.Screen
        name="EditProfile"
        component={EditProfilePage}
        options={{title: 'Edit Profile Info'}}
      />
      <MessagesStack.Screen
        name="FollowingThem"
        component={FollowingThemPage}
        options={{title: 'Followers'}}
      />
      <MessagesStack.Screen
        name="TheyFollowing"
        component={TheyFollowingPage}
        options={{title: 'Following'}}
      />
      <MessagesStack.Screen
        name="WebViewer"
        component={WebViewer}
        options={{title: ''}}
      />
      <MessagesStack.Screen
        name="CollectionStackScreens"
        component={CollectionNavigation}
        options={{headerShown: false}}
      />
      <MessagesStack.Screen
        name="CardDetailStackScreens"
        component={CardDetailNavigation}
        options={{headerShown: false}}
      />
      <MessagesStack.Screen
        name="DealsScreens"
        component={DealNavigation}
        options={{headerShown: false}}
      />
    </MessagesStack.Navigator>
  );
});

MessageNavigation.displayName = 'MessageNavigation';
