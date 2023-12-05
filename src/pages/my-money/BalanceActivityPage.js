import React, {Suspense, useState, useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  FooterIndicator,
} from 'components';
import NoResult from './components/NoResult';
import RedeemableBalanceItem from './components/RedeemableBalanceItem'

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {createUseStyle} from 'theme';
import {Constants} from 'globals';

const BalanceActivityPage = ({
  navigation
}) => {
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
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <MainContent
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  )
};

const MainContent = ({
  queryOptions,
}) => {
  const viewerData = useLazyLoadQuery(graphql`
    query BalanceActivityPageQuery {
      viewer {
        myMoney {
          settled {
            ...BalanceActivityPage_ledger
          }
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  return (
    <Content ledger={viewerData.viewer?.myMoney?.settled} />
  );
};

const Content = ({
  ledger
}) => {
  const styles = useStyle();

  const {data, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment BalanceActivityPage_ledger on Ledger
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "BalanceActivityPagePaginationQuery") {
      entries(after: $after, first: $first)
      @connection(key: "BalanceActivityPage_ledger__entries") {
        edges {
          node {
            ...RedeemableBalanceItem_ledgerEntry
          }
        }
      }
    }`,
    ledger
  );

  const handleRefetch = () => {
    refetch({}, {fetchPolicy: 'network-only'});
  };

  const renderItem = ({item}) => (
    <RedeemableBalanceItem
      ledgerEntry={item.node}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={data?.entries?.edges?.length > 0 ? {} : styles.contentContainer}
      data={data?.entries?.edges || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      onRefresh={handleRefetch}
      refreshing={false}
      ListEmptyComponent={<NoResult />}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.3}
      onEndReached={() => hasNext && loadNext(Constants.defaultFetchLimit)}
    />
  );
};

export default BalanceActivityPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
