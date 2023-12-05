import React from 'react';
import {View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';

import {
  TabBarIcon,
  TabBarCameraButton,
  TabBar,
} from 'components';

import {HomeNavigation} from './home';
import {CollectionNavigation} from './collection';
import {MessageNavigation} from './message';
import {ProfileNavigation} from './profile';

import {Colors} from 'theme';
import {filter} from 'store/stores';

const BottomTab = createBottomTabNavigator();

export const BottomTabNavigation = React.memo(() => {
  const styles = useSelector(state => state.navigationOptions.navigationStyles);
  const dispatch = useDispatch();

  return (
    <BottomTab.Navigator
      // initialRouteName="Profile"
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.lightGray,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: Platform.OS === 'android',
        tabBarStyle: styles.tabBarContainer,
        headerShown: false,
      }}>
      <BottomTab.Screen
        name="HomeBottomTab"
        component={HomeNavigation}
        options={() => ({
          tabBarIcon: ({color}) => (
            <TabBarIcon name="home" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="CollectionBottomTab"
        component={CollectionNavigation}
        options={() => ({
          tabBarIcon: ({color}) => (
            <TabBarIcon name="collection" color={color} />
          ),
        })}
        listeners={{
          tabPress: () => {
            dispatch(filter.actions.setEnabledPreserveSettings(true));
          },
        }}
      />
      <BottomTab.Screen
        name="CameraBottomTab"
        component={View}
        options={bottomProps => ({
          tabBarButton: () => (
            <TabBarCameraButton {...bottomProps} />
          ),
        })}
      />
      <BottomTab.Screen
        name="MessagesBottomTab"
        component={MessageNavigation}
        options={() => ({
          tabBarIcon: ({color}) => (
            <TabBarIcon name="message" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="ProfileBottomTab"
        component={ProfileNavigation}
        options={() => ({
          tabBarIcon: ({color}) => (
            <TabBarIcon name="profile" color={color} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
});

BottomTabNavigation.displayName = 'BottomTabNavigation';
