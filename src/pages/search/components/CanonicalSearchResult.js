import React, {useMemo, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  FooterIndicator,
  KeyboardAvoidingFlatList,
} from 'components';
import DatabaseItem from './DatabaseItem';
import NoResult from './NoResult';

import {createUseStyle, Fonts} from 'theme';
import {Constants, SchemaTypes, SearchFilterOptions} from 'globals';
import {wp} from 'utils';
import {useActions} from 'actions';

const CanonicalSearchResult = ({
  queryOptions,
  searchText,
  selectedCategory,
  mainFilterOptions,
  savedSearchSource,
  onBackSearch,
}) => {
  const withOptions = useMemo(() => {
    const options = {};

    // categories
    if (selectedCategory?.sport) {
      options.sport = selectedCategory.sport;
    } else if (selectedCategory?.game) {
      options.game = selectedCategory.game;
    }

    if (!mainFilterOptions?.length) {
      return options;
    }

    // flags
    const sportFlags = [];
    const gameFlags = [];

    mainFilterOptions.map(option => {
      const {schemaValue, value} = option;

      if (!value) {
        return;
      }

      if (!schemaValue) {
        return;
      }

      if (value === SearchFilterOptions.filterValues.yes || value === SearchFilterOptions.filterValues.no) {
        const flag = schemaValue;
        const presence = value === SearchFilterOptions.filterValues.yes;

        if (SchemaTypes.sportCardFlag[schemaValue]) {
          sportFlags.push({
            flag,
            presence,
          });
        } else if (SchemaTypes.gameCardFlag[schemaValue]) {
          gameFlags.push({
            flag,
            presence,
          });
        }
      }
    });

    if (sportFlags.length) {
      options.sportFlags = sportFlags;
    }

    if (gameFlags.length) {
      options.gameFlags = gameFlags;
    }

    return options;
  }, [selectedCategory, mainFilterOptions]);

  const orderByOptions = useMemo(() => {
    let options = [];

    if (!mainFilterOptions?.length) {
      return options;
    }

    const {options: sortByOptions, value} = mainFilterOptions.find(
      option => option.name === SearchFilterOptions.filterNames.sortBy,
    );

    if (value) {
      const sortByItem = sortByOptions.find(item => item.value === value);

      if (sortByItem?.schemaValue) {
        options = [sortByItem.schemaValue];
      }
    }

    return options;
  }, [mainFilterOptions]);

  const searchData = useLazyLoadQuery(graphql`
    query CanonicalSearchResultQuery($keywords: String!, $orderBy: [SearchCardsOrder], $canonicalCardsWith: SearchCardsWith) {
      search(keywords: $keywords) {
        ...CanonicalSearchResult_search @arguments(orderBy: $orderBy, canonicalCardsWith: $canonicalCardsWith)
      }
    }`,
    {
      keywords: searchText || '',
      orderBy: orderByOptions,
      canonicalCardsWith: withOptions,
    },
    queryOptions,
  );

  return (
    <Content
      keyword={searchText}
      search={searchData.search}
      savedSearchSource={savedSearchSource}
      onBackSearch={onBackSearch}
    />
  );
};

const Content = ({
  search,
  keyword,
  savedSearchSource,
  onBackSearch,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyle();
  const actions = useActions();

  const keyboardAvoidFlatListRef = useRef(null);

  const {data: allCardsData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment CanonicalSearchResult_search on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[SearchCardsOrder]"}
      canonicalCardsWith: {type: "SearchCardsWith"}
    )
    @refetchable(queryName: "CanonicalSearchResultPaginationQuery") {
      cards(after: $after, first: $first, orderBy: $orderBy, with: $canonicalCardsWith)
      @connection(key: "CanonicalSearchResult_search__cards") {
        count
        edges {
          node {
            ...DatabaseItem_card
          }
        }
      }
    }`,
    search,
  );

  const {cards} = allCardsData || {};

  const cardsCount = useMemo(() => (
    `${cards?.count || 0}${cards?.count >= 1000 ? '+' : ''} Record${cards?.count > 1 ? 's' : ''} found`
  ), [cards?.count]);

  useEffect(() => {
    if (!keyboardAvoidFlatListRef.current) {
      return;
    }

    keyboardAvoidFlatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [keyword]);

  if (!cards) {
    return null;
  }

  const handleRefetch = () => {
    refetch({
    }, {
      fetchPolicy: 'network-only',
    });
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  const handleSelect = cardId => {
    if (onBackSearch) {
      onBackSearch(cardId);
      return;
    }

    actions.saveSearch({
      query: keyword,
      source: savedSearchSource || SchemaTypes.savedSearchSource.DEFAULT,
      topics: [SchemaTypes.savedSearchTopic.CARD],
    });

    actions.pushCanonicalCardDetail(cardId);
  };

  const renderItem = ({item}) => (
    <DatabaseItem
      card={item.node}
      onPress={handleSelect}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        {cardsCount}
      </Text>
      <KeyboardAvoidingFlatList
        ref={keyboardAvoidFlatListRef}
        contentContainerStyle={[
          styles.contentContainer,
          {paddingBottom: insets.bottom || 0},
        ]}
        data={cards?.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={handleRefetch}
        onEndReachedThreshold={0.2}
        onEndReached={handleEndReached}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<NoResult />}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    width: wp(100),
  },
  searchBarContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  contentContainer: {
    paddingTop: 8,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textTransform: 'capitalize',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
}));

export default CanonicalSearchResult;
