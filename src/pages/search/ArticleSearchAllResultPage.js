import React, {Suspense, useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';

import {
  LoadingIndicator,
  FooterIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  SearchBar,
  KeyboardAvoidingFlatList,
} from 'components';
import ArticleItem from './components/ArticleItem';
import NoResult from './components/NoResult';

import {createUseStyle, Fonts} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants, SchemaTypes} from 'globals';
import {withSearch} from 'store/containers';
import {openUrl, decodeQuery} from 'utils';

const ArticleSearchAllResultPage = (props) => {
  const {
    searchText = '',
    query,
  } = props.route.params || {};
  const {navigation} = props;

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
  }, []);

  useEffect(() => {
    setNavigationBar();
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
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <MainContent
              {...props}
              queryOptions={refreshedQueryOptions}
              searchText={currentSearchText}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const MainContent = (props) => {
  const {
    queryOptions,
    searchText,
  } = props;

  const searchData = useLazyLoadQuery(graphql`
    query ArticleSearchAllResultPageQuery($keywords: String!) {
      search(keywords: $keywords) {
        ...ArticleSearchAllResultPage_search
      }
    }`,
    {
      keywords: searchText || '',
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
  search,
  keyword,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const keyboardAvoidFlatListRef = useRef(null);

  const {data: allArticlesData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment ArticleSearchAllResultPage_search on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "ArticleSearchAllResultPagePaginationQuery") {
      articles(after: $after, first: $first)
      @connection(key: "ArticleSearchAllResultPage_search__articles") {
        count
        edges {
          node {
            ...ArticleItem_article
          }
        }
      }
    }`,
    search,
  );

  const {articles} = allArticlesData || {};

  const articlesCount = useMemo(() => (
    `${articles?.count || 0}${articles?.count >= 1000 ? '+' : ''} Article${articles?.count > 1 ? 's' : ''} found`
  ), [articles?.count]);

  useEffect(() => {
    if (!keyboardAvoidFlatListRef.current) {
      return;
    }

    keyboardAvoidFlatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [keyword]);

  if (!articles) {
    return null;
  }

  const handleSelect = articleUrl => {

    actions.saveSearch({
      query: keyword,
      source: SchemaTypes.savedSearchSource.DEFAULT,
      topics: [],
    });

    if (articleUrl) {
      openUrl(articleUrl);
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
    <ArticleItem
      article={item.node}
      onPress={handleSelect}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        {articlesCount}
      </Text>
      <KeyboardAvoidingFlatList
        ref={keyboardAvoidFlatListRef}
        style={styles.container}
        data={articles?.edges || []}
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

export default withSearch(ArticleSearchAllResultPage);
