import React, {Suspense, useState, useCallback, useRef, useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  KeyboardAvoidingFlatList,
  ErrorBoundaryWithRetry,
  ErrorView,
  LoadingIndicator,
  FooterIndicator,
} from 'components';
import SuggestSearchItem from './SuggestSearchItem';
import SuggestTextItem from './SuggestTextItem';
import NoResult from './NoResult';

import {Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {Constants} from 'globals';
import createActions from '../actions';

const SuggestSearches = (props) => {
  const styles = useStyle();
  const {navigation} = props;

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

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
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <MainContent
              {...props}
              queryOptions={refreshedQueryOptions ?? {}}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const MainContent = (props) => {
  const {
    searchText,
    selectedCategory,
    queryOptions,
  } = props;

  const withOptions = useMemo(() => {
    const options = {};

    if (selectedCategory?.sport) {
      options.sport = selectedCategory.sport;
    } else if (selectedCategory?.game) {
      options.game = selectedCategory.game;
    }

    return options;
  }, [selectedCategory]);

  const searchData = useLazyLoadQuery(graphql`
    query SuggestSearchesQuery(
      $keywords: String!,
      $suggestionsWith: SearchSuggestionsWith,
    ) {
      search(keywords: $keywords) {
        ...SuggestSearches_search @arguments(suggestionsWith: $suggestionsWith)
      }
    }`,
    {
      keywords: searchText || '',
      suggestionsWith: withOptions,
    },
    queryOptions,
  );

  return (
    <Content {...props} search={searchData.search} />
  );
};

const Content = ({
  search,
  searchText,
  onSelectSearch,
  onSelectSearchText,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyle();

  const keyboardAvoidFlatListRef = useRef(null);

  const {data: suggestionsData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment SuggestSearches_search on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      suggestionsWith: {type: "SearchSuggestionsWith"}
    )
    @refetchable(queryName: "SuggestSearchesPaginationQuery") {
      suggestions(after: $after, first: $first, with: $suggestionsWith)
      @connection(key: "SuggestSearches_search__suggestions") {
        edges {
          node {
            ...SuggestSearchItem_searchSuggestion
          }
        }
      }
    }`,
    search,
  );

  const {suggestions} = suggestionsData || {};

  useEffect(() => {
    if (!keyboardAvoidFlatListRef.current) {
      return;
    }

    keyboardAvoidFlatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [searchText]);

  if (!suggestions) {
    return null;
  }

  const handleSelectSearchText = () => {
    if (onSelectSearchText) {
      onSelectSearchText(searchText);
    }
  };

  const handleSelectSearch = item => {
    if (onSelectSearch) {
      onSelectSearch(item);
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

  const renderItem = ({item: {node}}) => (
    <SuggestSearchItem
      suggestion={node}
      onPress={handleSelectSearch}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <View style={styles.container}>
      <SuggestTextItem
        label={searchText}
        onPress={handleSelectSearchText}
      />
      <KeyboardAvoidingFlatList
        ref={keyboardAvoidFlatListRef}
        contentContainerStyle={[
          styles.contentContainer,
          {paddingBottom: insets.bottom || 0}
        ]}
        data={suggestions.edges || []}
        isInitialKeyboard
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

const useStyle = createUseStyle(() => ({
  container: {
    flex: 1,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));

export default SuggestSearches;
