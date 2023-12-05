import React from 'react';
import {graphql, usePaginationFragment} from 'react-relay';
import {FlatList} from 'react-native';

import {
  FooterIndicator,
} from 'components';
import TradingCardOwnerListItem from './TradingCardOwnerListItem';

import {Constants} from 'globals';

const TradingCardOwnerList = (props) => {
  const {data: tradingCardData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment TradingCardOwnerList_card on Card
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "TradingCardOwnerListPaginationQuery") {
      tradingCards(after: $after, first: $first)
      @connection(key: "TradingCardOwnerList_card__tradingCards") {
        edges {
          node {
            ...TradingCardOwnerListItem_tradingCard
          }
        }
      }
    }`,
    props.card
  );

  if (!tradingCardData) {
    return null;
  }

  const handleRefresh = () => {
    refetch({}, {fetchPolicy: 'network-only'});
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
    <TradingCardOwnerListItem tradingCard={edge.node} />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      data={tradingCardData?.tradingCards?.edges || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefresh}
      refreshing={false}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

export default TradingCardOwnerList;
