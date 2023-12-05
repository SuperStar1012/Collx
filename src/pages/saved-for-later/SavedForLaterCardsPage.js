import React, {Suspense, useState, useCallback} from 'react';
import {View} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SavedForLaterCardsContent from './SavedForLaterCardsContent';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {createUseStyle} from 'theme';

const SavedForLaterCardsPage = (props) => {
  const {navigation, route} = props;
  const savedForLater = route.params?.savedForLater;

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
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <SavedForLaterCardsContent
              queryOptions={refreshedQueryOptions}
              savedForLater={savedForLater}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  )
};

export default SavedForLaterCardsPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
