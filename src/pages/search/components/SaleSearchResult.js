import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {FlatList} from 'react-native';
import {graphql, usePaginationFragment} from 'react-relay';

import {
  FooterIndicator,
  GridViewItem,
} from 'components';
import UniversalSectionHeader from './UniversalSectionHeader';

import {createUseStyle} from 'theme';
import {Constants} from 'globals';

const SaleSearchResult = forwardRef(({
  search,
  onSelectTradingCard,
  onChangeSearchCategory,
  onViewAllSaleCards,
}, ref) => {
  const styles = useStyle();

  const {data: allTradingCardsData, loadNext, isLoadingNext, hasNext} = usePaginationFragment(graphql`
    fragment SaleSearchResultSearch on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      listedTradingCardsWith: {type: "SearchListedTradingCardsWith"}
    )
    @refetchable(queryName: "SaleSearchResultSearchPaginationQuery") {
      listedTradingCards(after: $after, first: $first, with: $listedTradingCardsWith)
      @connection(key: "SaleSearchResultSearch_search__listedTradingCards") {
        count
        edges {
          node {
            ...GridViewItem_tradingCard
          }
        }
      }
    }`,
    search,
  );

  const {listedTradingCards} = allTradingCardsData || {};

  const isHasTradingCards = !!listedTradingCards?.edges?.length;

  useEffect(() => {
    if (onChangeSearchCategory) {
      onChangeSearchCategory(Object.keys(Constants.searchCategories)[1], isHasTradingCards);
    }
  }, [isHasTradingCards]);

  const loadNextSaleCards = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  useImperativeHandle(ref, () => ({
    loadNextSaleCards,
  }));

  if (!listedTradingCards) {
    return null;
  }

  if (!isHasTradingCards) {
    return null;
  }

  const handleSelect = tradingCard => {
    if (tradingCard?.id && onSelectTradingCard) {
      onSelectTradingCard(tradingCard.id);
    }
  };

  const handleViewAll = () => {
    if (onViewAllSaleCards) {
      onViewAllSaleCards();
    }
  };

  const renderHeader = () => (
    <UniversalSectionHeader
      title="For Sale"
      onViewAll={handleViewAll}
    />
  );

  const renderItem = ({item}) => (
    <GridViewItem
      tradingCard={item.node}
      onPress={handleSelect}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={listedTradingCards?.edges || []}
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
    />
  );
});

SaleSearchResult.displayName = 'SaleSearchResult';

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexGrow: 0,
    backgroundColor: colors.primaryBackground,
    paddingBottom: 8,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
}));

export default SaleSearchResult;
