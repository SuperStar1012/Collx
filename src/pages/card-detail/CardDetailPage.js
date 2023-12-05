import React, {useState, useCallback, Suspense} from 'react';
import {View} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import TradingCardContent from './TradingCardContent';
import CanonicalCardContent from './CanonicalCardContent';

import ActionContext, {
  useActions,
  createNavigationActions,
  createSharingActions,
} from 'actions';
import createActions from './actions';
import {createUseStyle} from 'theme';

const CardDetailPage = ({
  navigation,
  route,
}) => {
  const {
    canonicalCardId, // It's null if "tradingCardId' has
    tradingCardId, // It's null if "canonicalCardId' has
    tradingCardIdForIssue, // TODO: Remove later. It's for price report in Canonical Card
    scrollToComment,
  } = route.params || {};

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
    ...createActions({navigation}),
    ...createSharingActions(),
    refresh: handleRefresh,
  };

  const renderContent = () => {
    if (tradingCardId) {
      return (
        <TradingCardContent
          navigation={navigation}
          tradingCardId={tradingCardId}
          scrollToComment={scrollToComment}
          queryOptions={refreshedQueryOptions}
        />
      );
    } else if (canonicalCardId) {
      return (
        <CanonicalCardContent
          navigation={navigation}
          canonicalCardId={canonicalCardId}
          tradingCardIdForIssue={tradingCardIdForIssue}
          queryOptions={refreshedQueryOptions}
        />
      );
    }

    return null;
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            {renderContent()}
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
}

export default CardDetailPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
