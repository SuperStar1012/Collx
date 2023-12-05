import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import MessageCardSendPage from '../pages/collection/MessageCardSendPage';

import {Styles} from 'globals';

const CardMessageStack = createStackNavigator();

export const CardMessageNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CardMessageStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight: Styles.headerStatusBarHeight,
      }}>
      <CardMessageStack.Screen
        name="MessageCardSend"
        component={MessageCardSendPage}
        options={{title: 'Send Card'}}
      />
    </CardMessageStack.Navigator>
  );
});

CardMessageNavigation.displayName = 'CardMessageNavigation';
