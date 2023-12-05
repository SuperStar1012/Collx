import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import ReferralProgram from '../pages/referral/ReferralProgram';
import RedeemReward from '../pages/referral/RedeemReward';
import RedeemRewardSuccess from '../pages/referral/RedeemRewardSuccess';

const ReferralStack = createStackNavigator();

export const ReferralNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <ReferralStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <ReferralStack.Screen
        name="ReferralProgram"
        component={ReferralProgram}
        options={{title: null}}
      />
      <ReferralStack.Screen
        name="RedeemReward"
        component={RedeemReward}
      />
      <ReferralStack.Screen
        name="RedeemRewardSuccess"
        component={RedeemRewardSuccess}
        options={{headerShown: false}}
      />
    </ReferralStack.Navigator>
  );
});

ReferralNavigation.displayName = 'ReferralNavigation';
