import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import DealPage from '../pages/deal/DealPage';
import MakeOfferPage from '../pages/make-offer/MakeOfferPage';
import MyDealsPage from '../pages/my-deals-buyers/MyDealsPage';
import MyBuyersPage from '../pages/my-deals-buyers/MyBuyersPage';
import SavedForLaterPage from '../pages/saved-for-later/SavedForLaterPage';
import SavedForLaterCardsPage from '../pages/saved-for-later/SavedForLaterCardsPage';
import EditProfilePage from '../pages/edit-profile/EditProfilePage';

import {MessageNavigation} from './message';

const DealStack = createStackNavigator();

export const DealNavigation = React.memo(() => {
  const styles = useSelector(state => state.navigationOptions.navigationStyles);
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <DealStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <DealStack.Screen name="Deal" component={DealPage} />
      <DealStack.Screen
        name="MakeOffer"
        component={MakeOfferPage}
        options={{
          headerStyle: styles.headerContainer,
          title: 'Make Offer',
        }}
      />
      <DealStack.Screen
        name="MyDeals"
        component={MyDealsPage}
        options={{
          title: 'My Deals',
          headerShadowVisible: false,
        }}
      />
      <DealStack.Screen
        name="MyBuyers"
        component={MyBuyersPage}
        options={{
          title: 'My Buyers',
          headerShadowVisible: false,
        }}
      />
      <DealStack.Screen
        name="SavedForLater"
        component={SavedForLaterPage}
        options={{
          title: 'Saved For Later',
        }}
      />
      <DealStack.Screen
        name="SavedForLaterCards"
        component={SavedForLaterCardsPage}
        options={{
          title: 'Saved For Later',
        }}
      />
      <DealStack.Screen
        name="EditProfile"
        component={EditProfilePage}
        options={{title: 'Edit Profile Info'}}
      />
      <DealStack.Screen
        name="MessageScreens"
        component={MessageNavigation}
        options={{
          headerTitleAlign: 'left',
          headerShown: false,
        }}
      />
    </DealStack.Navigator>
  );
});

DealNavigation.displayName = 'DealNavigation';
