import React, {forwardRef, useImperativeHandle} from 'react';
import {Text, View, FlatList} from 'react-native';
import {graphql, usePaginationFragment} from 'react-relay';

import {
  FooterIndicator,
} from 'components';
import MoreListItem from './MoreListItem';

import {Fonts, createUseStyle} from 'theme';
import {Constants} from 'globals';

const MoreList = forwardRef(({
  style,
  deal,
  sellerName,
  onAddCard,
  onRemoveCard,
  onSelectCard,
}, ref) => {
  const styles = useStyle();

  const {data: dealData, loadNext, isLoadingNext, hasNext} = usePaginationFragment(graphql`
    fragment MoreList_deal on Deal
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "MoreListPaginationQuery") {
      tradingCardsRecommendedForBuyer(after: $after, first: $first)
      @connection(key: "MoreList_deal__tradingCardsRecommendedForBuyer") {
        edges {
          node {
            id
            ...MoreListItem_tradingCard
          }
        }
      }
    }`,
    deal
  );

  if (dealData.tradingCardsRecommendedForBuyer.edges.length === 0) {
    return null;
  }

  const loadNextTradingCards = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  useImperativeHandle(ref, () => ({
    loadNextTradingCards,
  }));

  const renderItem = ({item}) => (
    <MoreListItem
      key={item.node.id}
      tradingCard={item.node}
      onAddCard={onAddCard}
      onRemoveCard={onRemoveCard}
      onSelect={onSelectCard}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={!!dealData.tradingCardsRecommendedForBuyer.edges.length && isLoadingNext} />
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>More from {sellerName}</Text>
      <FlatList
        data={dealData.tradingCardsRecommendedForBuyer.edges || []}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
        numColumns={2}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
});

MoreList.displayName = 'MoreList';

export default MoreList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginTop: 25,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginBottom: 15,
  },
}));
