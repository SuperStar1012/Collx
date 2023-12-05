import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import MyMoneyPage from '../pages/my-money/MyMoneyPage';
import WithdrawHistoryPage from '../pages/my-money/WithdrawHistoryPage';
import BalanceActivityPage from '../pages/my-money/BalanceActivityPage';
import CreditHistoryPage from '../pages/my-money/CreditHistoryPage';
import SelectBankAccountPage from '../pages/bank/SelectBankAccountPage';
import LinkBankAccountPage from '../pages/bank/LinkBankAccountPage';
import EditConnectedAccountInfoPage from '../pages/bank/EditConnectedAccountInfoPage';
import ConfirmRedeemPage from '../pages/bank/ConfirmRedeemPage';
import RedeemAmountPage from '../pages/bank/RedeemAmountPage';
import WithdrawSuccessPage from '../pages/bank/WithdrawSuccessPage';
import EnterCollXCreditCodePage from '../pages/collx-credit-code/EnterCollXCreditCodePage';
import CollXCreditCodeSuccessPage from '../pages/collx-credit-code/CollXCreditCodeSuccessPage';

const MyMoneyStack = createStackNavigator();

export const MyMoneyNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <MyMoneyStack.Navigator
      screenOptions={{
        ...screenOptions,
      }}>
      <MyMoneyStack.Screen
        name="MyMoney"
        component={MyMoneyPage}
        options={{
          title: 'My Money',
        }}
      />
      <MyMoneyStack.Screen
        name="WithdrawHistory"
        component={WithdrawHistoryPage}
        options={{
          title: 'Withdraw History',
        }}
      />
      <MyMoneyStack.Screen
        name="BalanceActivity"
        component={BalanceActivityPage}
        options={{
          title: 'Balance Activity',
        }}
      />
      <MyMoneyStack.Screen
        name="CreditHistory"
        component={CreditHistoryPage}
        options={{
          title: 'CollX Credit History',
        }}
      />
      <MyMoneyStack.Screen
        name="SelectBankAccount"
        component={SelectBankAccountPage}
        options={{
          title: 'Linked Bank Account',
        }}
      />
      <MyMoneyStack.Screen
        name="LinkBankAccount"
        component={LinkBankAccountPage}
        options={{
          title: 'Link Bank Account',
        }}
      />
      <MyMoneyStack.Screen
        name="EditConnectedAccountInfo"
        component={EditConnectedAccountInfoPage}
        options={{
          title: 'Edit Account Info',
        }}
      />
      <MyMoneyStack.Screen
        name="ConfirmRedeem"
        component={ConfirmRedeemPage}
        options={{
          title: 'Balance',
        }}
      />
      <MyMoneyStack.Screen
        name="RedeemAmount"
        component={RedeemAmountPage}
        options={{
          title: 'Redeem Amount',
        }}
      />
      <MyMoneyStack.Screen
        name="WithdrawSuccess"
        component={WithdrawSuccessPage}
        options={{
          title: 'Balance Withdrawal',
        }}
      />
      <MyMoneyStack.Screen
        name="EnterCollXCreditCode"
        component={EnterCollXCreditCodePage}
        options={{
          title: 'CollX Credit Code',
        }}
      />
      <MyMoneyStack.Screen
        name="CollXCreditCodeSuccess"
        component={CollXCreditCodeSuccessPage}
        options={{
          title: 'CollX Credit Code',
        }}
      />
    </MyMoneyStack.Navigator>
  );
});

MyMoneyNavigation.displayName = 'MyMoneyNavigation';
