/* eslint-disable no-undef */
import React, {useCallback, useState, Suspense} from 'react';
import {View} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import AccountSettingsContent from './AccountSettingsContent';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {createUseStyle} from 'theme';
import createActions from './actions';

const AccountSettingsPage = props => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions(prev => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <AccountSettingsContent
              {...props}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

export default AccountSettingsPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
