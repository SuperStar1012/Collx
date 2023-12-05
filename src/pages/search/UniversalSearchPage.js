import React, {Suspense, useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  SearchBar,
} from 'components';
import UniversalSearchResult from './components/UniversalSearchResult';
import UniversalSearchHeader from './components/UniversalSearchHeader';

import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withSearch} from 'store/containers';
import {Constants} from 'globals';
import {analyticsNavigationRoute} from 'services';

const UniversalSearchPage = (props) => {
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
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              {...props}
              queryOptions={refreshedQueryOptions ?? {}}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({
  navigation,
  route,
  searchedCards,
  searchedSaleCards,
  selectedCategory,
  resetSearchedCards,
  queryOptions,
}) => {
  const {
    query: initialSearchText,
    aiPromptSuggestion,
  } = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  const [searchText, setSearchText] = useState(initialSearchText);

  const searchedCategoriesRef = useRef([]);
  const [searchedCategories, setSearchedCategories] = useState(searchedCategoriesRef.current);

  const searchBarRef = useRef(null);

  const selectedQueryRef = useRef(initialSearchText);
  const [selectedQuery, setSelectedQuery] = useState(selectedQueryRef.current);
  const searchedCardsCount = useRef(searchedCards.length);

  const [inSearchMode, setInSearchMode] = useState(!!initialSearchText);

  const viewerData = useLazyLoadQuery(graphql`
    query UniversalSearchPageQuery {
      viewer {
        profile {
          id
          type
        }
      }
    }`,
    {},
    queryOptions,
  );

  const currentCategoryLabel = useMemo(() => (
    selectedCategory ? selectedCategory.label : 'All'
  ), [selectedCategory]);

  useEffect(() => {
    setNavigationBar();

    setTimeout(() => {
      if (inSearchMode && searchBarRef.current) {
        searchBarRef.current.focus();
      }
    }, 500);

    return () => {
      resetSearchedCards();
    };
  }, []);

  useEffect(() => {
    if (!searchText || searchText.startsWith(' ')) {
      selectedQueryRef.current = ''
    } else {
      selectedQueryRef.current = searchText;
    }

    const delayDebounceFn = setTimeout(() => {
      setSelectedQuery(selectedQueryRef.current);
    }, Constants.searchDelayDebounce);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  useEffect(() => {
    searchedCardsCount.current =
      searchedCards.length || searchedSaleCards.length;
  }, [searchedCards, searchedSaleCards]);

  const setNavigationBar = () => {
    const navigationOptions = {};

    navigationOptions.headerTitle = renderSearchBar;
    navigationOptions.headerTitleContainerStyle = styles.headerContainer;

    navigation.setOptions(navigationOptions);
  };

  const handleCategory = () => {
    navigation.openDrawer();
  };

  const handleSelectSearchCategory = (searchCategory) => {
    switch (Constants.searchCategories[searchCategory]) {
      case Constants.searchCategories.database:
        actions.navigateDatabaseSearchAll({
          searchText,
        });
        break;
      case Constants.searchCategories.forSale:
        actions.navigateSaleSearchAll({
          searchText,
        });
      break;
      case Constants.searchCategories.articles:
        actions.navigateArticleSearchAll({
          searchText,
        });
      break;
    }
  };

  const handleChangeSearchCategory = (searchCategory, isHasData) => {
    if (isHasData) {
      const index = searchedCategoriesRef.current.findIndex(item => item === searchCategory);
      if (index === -1) {
        searchedCategoriesRef.current = [
          ...searchedCategoriesRef.current,
          searchCategory
        ];
      }
    } else {
      searchedCategoriesRef.current = searchedCategoriesRef.current.filter(item => item !== searchCategory);
    }

    setSearchedCategories(searchedCategoriesRef.current);
  };

  const handleChangeSearch = value => {
    setSearchText(value);
  };

  const handleCancelSearch = () => {
    if (!initialSearchText) {
      selectedQueryRef.current = null;
      navigation.dispatch(StackActions.popToTop());
      return;
    }

    setInSearchMode(false);
    setSearchText('');
  };

  const handleDeleteSearch = () => {
    setSearchText('');
  };

  const handleFocus = () => {
    setInSearchMode(true);
  };

  const handleBlur = () => {
    setInSearchMode(false);
  };

  const handleCollXAI = (message) => {
    const {id: profileId, type: profileType} = viewerData?.viewer?.profile || {};

    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.Search,
      });
      return;
    }

    if (profileId) {
      actions.navigateChatBotMessage({
        profileId,
        message,
        source: analyticsNavigationRoute.Search,
      });
    }
  };

  const renderSearchBar = () => (
    <SearchBar
      ref={searchBarRef}
      style={styles.searchBarContainer}
      defaultValue={searchText}
      onChangeText={handleChangeSearch}
      onDelete={handleDeleteSearch}
      onCancel={handleCancelSearch}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );

  return (
    <View style={styles.container}>
      <UniversalSearchHeader
        categoryLabel={currentCategoryLabel}
        searchedCategories={searchedCategories}
        onPressCategory={handleCategory}
        onPressSearch={handleSelectSearchCategory}
      />
      <UniversalSearchResult
        queryOptions={queryOptions}
        searchText={selectedQuery}
        aiPromptSuggestion={aiPromptSuggestion}
        selectedCategory={selectedCategory}
        searchedCategories={searchedCategories}
        onChangeSearchCategory={handleChangeSearchCategory}
        onOpenCollXAI={handleCollXAI}
      />
    </View>
  );
};

export default withSearch(UniversalSearchPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  headerContainer: {
    width: '100%',
    borderWidth: 0,
  },
  searchBarContainer: {
    marginLeft: 10,
    marginVertical: 10,
  },
}));
