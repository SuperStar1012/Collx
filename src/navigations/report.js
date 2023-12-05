import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import ReportIssuePage from '../pages/report/ReportIssuePage';
import ReportIssueDetailPage from '../pages/report/ReportIssueDetailPage';
import ReportIssueConfirmPage from '../pages/report/ReportIssueConfirmPage';

import {Styles} from 'globals';

const ReportStack = createStackNavigator();

export const ReportNavigation = React.memo(() => {
  const screenOptions = useSelector(state => state.navigationOptions.screenOptions);

  return (
    <ReportStack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStatusBarHeight: Styles.headerStatusBarHeight,
      }}>
      <ReportStack.Screen
        name="ReportIssue"
        component={ReportIssuePage}
        options={{title: 'Report Issue'}}
      />
      <ReportStack.Screen
        name="ReportIssueDetail"
        component={ReportIssueDetailPage}
        options={{title: 'Report Issue'}}
      />
      <ReportStack.Screen
        name="ReportIssueConfirm"
        component={ReportIssueConfirmPage}
        options={{title: 'Report Issue'}}
      />
    </ReportStack.Navigator>
  );
});

ReportNavigation.displayName = 'ReportNavigation';
