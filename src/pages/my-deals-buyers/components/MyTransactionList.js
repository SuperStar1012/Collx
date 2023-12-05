import React from 'react';
import {graphql, usePaginationFragment} from 'react-relay';
import {FlatList} from 'react-native';

import {FooterIndicator} from 'components';
import MyTransactionListItem from './MyTransactionListItem'
import NoResult from './NoResult';

import {Constants, SchemaTypes} from 'globals';
import {useActions} from 'actions';
import {createUseStyle} from 'theme';

const MyTransactionList = ({
  viewer,
  transactionType,
  dealStates,
}) => {
  const actions = useActions();
  const styles = useStyle();

  const {data: viewerData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment MyTransactionListQuery_viewer on Viewer
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[DealsOrder!]"}
      dealCondition: {type: "DealsWith"}
    )
    @refetchable(queryName: "MyTransactionListPaginationQuery") {
      deals(after: $after, first: $first, orderBy: $orderBy, with:$dealCondition)
      @connection(key: "MyTransactionListQuery_viewer__deals") {
        edges {
          node {
            id
            ...MyTransactionListItem_deal
          }
        }
      }
    }`,
    viewer
  );

  if (!viewerData) {
    return null;
  }

  const handleRefetch = () => {
    const query = {
      dealCondition: {meAs: transactionType},
      orderBy: [SchemaTypes.dealsOrder.UPDATED_AT_DESC],
    };

    if (dealStates) {
      query.dealCondition.states = dealStates;
    }

    refetch(query, {fetchPolicy: 'network-only'});
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  const renderItem = ({item: edge}) => (
    <MyTransactionListItem
      deal={edge.node}
      transactionType={transactionType}
      onPress={() => actions.navigateDeal(edge.node.id)}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={viewerData.deals?.edges?.length > 0 ? {} : styles.contentContainer}
      data={viewerData.deals?.edges || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefetch}
      refreshing={false}
      ListEmptyComponent={<NoResult />}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

export default MyTransactionList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
