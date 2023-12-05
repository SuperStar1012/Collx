import React, {Suspense, useState, useCallback} from 'react';
import {View} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import TransactionContent from './TransactionContent';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {SchemaTypes} from 'globals';
import {createUseStyle} from 'theme';

const MyBuyersPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <TransactionContent
              transactionType={SchemaTypes.dealsWithMeAs.SELLER}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  )
};

export default MyBuyersPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
