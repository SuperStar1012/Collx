import React, {Suspense, useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';

import {
  LoadingIndicator,
  FooterIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  SearchBar,
  KeyboardAvoidingFlatList,
  GridViewItem,
} from 'components';
import HorizontalScrollFilters from './components/HorizontalScrollFilters';
import NoResult from './components/NoResult';

import {createUseStyle, Fonts} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants, SchemaTypes, SearchFilterOptions} from 'globals';
import {withSearch} from 'store/containers';
import {decodeQuery} from 'utils';

const SaleSearchAllResultPage = (props) => {
  const {
    searchText = '',
    query,
  } = props.route.params || {};

  const {
    navigation,
    setMainFilterOptions,
  } = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);
  const [initialSearchText, setInitialSearchText] = useState('');
  const [currentSearchText, setCurrentSearchText] = useState('');

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({
      navigation,
    }),
  };

  useEffect(() => {
    if (!query) {
      return;
    }
    setInitialSearchText(decodeQuery(query));
    setCurrentSearchText(decodeQuery(query));
  }, [query]);

  useEffect(() => {
    if (!searchText) {
      return;
    }
    setInitialSearchText(searchText);
    setCurrentSearchText(searchText);
  }, [searchText]);


  useEffect(() => {
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.userCards);
  }, []);

  useEffect(() => {
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.userCards);
  }, [initialSearchText, currentSearchText]);

  const setNavigationBar = () => {
    const navigationOptions = {};

    navigationOptions.headerTitle = renderSearchBar;
    navigationOptions.headerTitleContainerStyle = styles.headerContainer;

    navigation.setOptions(navigationOptions);
  };

  const handleChangeSearch = value => {
    setCurrentSearchText(value);
  };

  const handleDeleteSearch = () => {
    setCurrentSearchText('');
  };

  const handleCancelSearch = () => {
    setCurrentSearchText('');
  };

  const renderSearchBar = () => (
    <SearchBar
      style={styles.searchBarContainer}
      placeholder="Search all cards"
      defaultValue={initialSearchText}
      searchValue={currentSearchText}
      onChangeText={handleChangeSearch}
      onDelete={handleDeleteSearch}
      onCancel={handleCancelSearch}
    />
  );

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <HorizontalScrollFilters />
          <View style={styles.container}>
            <Suspense fallback={<LoadingIndicator isLoading />}>
              <MainContent
                {...props}
                queryOptions={refreshedQueryOptions}
                searchText={currentSearchText}
              />
            </Suspense>
          </View>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const MainContent = (props) => {
  const {
    queryOptions,
    searchText,
    selectedCategory,
    mainFilterOptions,
  } = props;

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

    // Accepting Offers
    const {value: acceptingOffersValue} = mainFilterOptions.find(option => option.name === SearchFilterOptions.filterNames.acceptingOffers) || {};
    if (acceptingOffersValue && acceptingOffersValue !== SearchFilterOptions.filterValues.allItems) {
      options.acceptingOffers = acceptingOffersValue === SearchFilterOptions.filterValues.yes;
    }

    // Seller Discount
    const {value: sellerDiscountValue} = mainFilterOptions.find(option => option.name === SearchFilterOptions.filterNames.sellerDiscount) || {};
    if (sellerDiscountValue && sellerDiscountValue !== SearchFilterOptions.filterValues.allItems) {
      options.sellerDiscount = sellerDiscountValue === SearchFilterOptions.filterValues.yes;
    }

    // Seller Discount
    const {value: freeShippingValue} = mainFilterOptions.find(option => option.name === SearchFilterOptions.filterNames.freeShipping) || {};
    if (freeShippingValue && freeShippingValue !== SearchFilterOptions.filterValues.allItems) {
      options.freeShipping = freeShippingValue === SearchFilterOptions.filterValues.yes;
    }

    // Conditions
    const {value: conditionValue} = mainFilterOptions.find(option => option.name === SearchFilterOptions.filterNames.condition) || {};
    if (conditionValue && conditionValue !== SearchFilterOptions.filterValues.allItems) {
      options.conditions = [conditionValue];
    }

    // Grade
    const gradeFilterOption = mainFilterOptions.find(option => option.name === SearchFilterOptions.filterNames.grade);
    const {value: gradeValue, options: gradeOptions} = gradeFilterOption || {};

    if (gradeValue && gradeValue !== SearchFilterOptions.filterValues.allItems) {
      // Graded
      const {value: gradedValue} = gradeOptions.find(({child}) => child.name === SearchFilterOptions.filterNames.graded) || {};
      options.graded = gradedValue === SearchFilterOptions.filterValues.yes;

      // Grader
      const {value: graderValue} = gradeOptions.find(({child}) => child.name === SearchFilterOptions.filterNames.grader) || {};
      // if (graderValue && graderValue !== SearchFilterOptions.filterValues.allItems) {
      //   options.grader = graderValue.toUpperCase();
      // }

      // grades
      const {lowValue: gradesLowValue, highValue: gradesHighValue} = gradeOptions.find(({child}) => child.name === SearchFilterOptions.filterNames.grades) || {};
      // if (gradesLowValue && gradesHighValue && gradesLowValue <= gradesHighValue) {
      //   const values = [];
      //   for(let step = gradesLowValue; step <= gradesHighValue; step += 0.5) {
      //     values.push(Number(step));
      //   }

      //   if (values.length) {
      //     options.grades = values;
      //   }
      // }
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
    console.log('!!!!', mainFilterOptions)
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
    query SaleSearchAllResultPageQuery($keywords: String!, $orderBy: [SearchListedTradingCardsOrder], $listedTradingCardsWith: SearchListedTradingCardsWith) {
      search(keywords: $keywords) {
        ...SaleSearchAllResultPage_search @arguments(orderBy: $orderBy, listedTradingCardsWith: $listedTradingCardsWith)
      }
    }`,
    {
      keywords: searchText || '',
      orderBy: orderByOptions,
      listedTradingCardsWith: withOptions,
    },
    queryOptions,
  );

  return (
    <Content
      {...props}
      keyword={searchText}
      search={searchData.search}
    />
  );
};

const Content = ({
  keyword,
  search,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const keyboardAvoidFlatListRef = useRef(null);

  const {data: allTradingCardsData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment SaleSearchAllResultPage_search on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[SearchListedTradingCardsOrder]"}
      listedTradingCardsWith: {type: "SearchListedTradingCardsWith"}
    )
    @refetchable(queryName: "SaleSearchAllResultPagePaginationQuery") {
      listedTradingCards(after: $after, first: $first, orderBy: $orderBy, with: $listedTradingCardsWith)
      @connection(key: "SaleSearchAllResultPage_search__listedTradingCards") {
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

  const listedTradingCardsCount = useMemo(() => (
    `${listedTradingCards?.count || 0}${listedTradingCards?.count >= 1000 ? '+' : ''} Listing${listedTradingCards?.count > 1 ? 's' : ''} found`
  ), [listedTradingCards?.count]);

  useEffect(() => {
    if (!keyboardAvoidFlatListRef.current) {
      return;
    }

    keyboardAvoidFlatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [keyword]);

  if (!listedTradingCards) {
    return null;
  }

  const handleSelect = tradingCard => {
    actions.saveSearch({
      query: keyword,
      source: SchemaTypes.savedSearchSource.DEFAULT,
      topics: [SchemaTypes.savedSearchTopic.TRADING_CARD],
    });

    if (tradingCard?.id) {
      actions.pushTradingCardDetail(tradingCard.id);
    }
  };

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
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        {listedTradingCardsCount}
      </Text>
      <KeyboardAvoidingFlatList
        ref={keyboardAvoidFlatListRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={listedTradingCards?.edges || []}
        numColumns={2}
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
    backgroundColor: colors.primaryBackground,
  },
  headerContainer: {
    width: '100%',
  },
  searchBarContainer: {
    marginLeft: 10,
  },
  contentContainer: {
    paddingTop: 8,
    paddingHorizontal: 8,
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

export default withSearch(SaleSearchAllResultPage);
