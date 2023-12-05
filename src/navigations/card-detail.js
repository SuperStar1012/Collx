import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import {SearchNavigation} from './search';

import CardDetailPage from '../pages/card-detail/CardDetailPage';
import TradingCardOwnersPage from '../pages/trading-card-owners/TradingCardOwnersPage';
import EditProfilePage from '../pages/edit-profile/EditProfilePage';
import MatchingTradingCardsPage from '../pages/matching-trading-cards/MatchingTradingCardsPage';

const CardDetailStack = createStackNavigator();

export const CardDetailNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <CardDetailStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShadowVisible: false,
      }}>
      <CardDetailStack.Screen
        name="CardDetail"
        component={CardDetailPage}
        options={{title: null}}
      />
      <CardDetailStack.Screen // For only deep-linking (old link)
        name="CanonicalCardDetail"
        component={CardDetailPage}
        options={{title: null}}
      />
      <CardDetailStack.Screen // For only deep-linking
        name="SportCanonicalCardDetail"
        component={CardDetailPage}
        options={{title: null}}
      />
      <CardDetailStack.Screen // For only deep-linking
        name="GameCanonicalCardDetail"
        component={CardDetailPage}
        options={{title: null}}
      />
      <CardDetailStack.Screen
        name="CardUsers"
        component={TradingCardOwnersPage}
        options={{
          title: 'Users With This Card',
          headerShadowVisible: true,
        }}
      />
      <CardDetailStack.Screen
        name="SearchStackScreens"
        component={SearchNavigation}
        options={{headerShown: false}}
      />
      <CardDetailStack.Screen
        name="EditProfile"
        component={EditProfilePage}
        options={{title: 'Edit Profile Info'}}
      />
      <CardDetailStack.Screen
        name="MatchingTradingCards"
        component={MatchingTradingCardsPage}
        options={{
          title: 'Matching Cards',
          headerShadowVisible: true,
        }}
      />
    </CardDetailStack.Navigator>
  );
});

CardDetailNavigation.displayName = 'CardDetailNavigation';
