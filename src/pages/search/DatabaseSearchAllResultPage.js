import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View, TextInput} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  SearchBar,
  NavBarButton,
  NavBarModalHeader,
} from 'components';
import HorizontalScrollFilters from './components/HorizontalScrollFilters';
import CanonicalSearchResult from './components/CanonicalSearchResult';

import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants, SchemaTypes, SearchFilterOptions} from 'globals';
import {withSearch} from 'store/containers';
import {decodeQuery} from 'utils';

const closeIcon = require('assets/icons/close.png');

const DatabaseSearchAllResultPage = (props) => {
  const {
    isCloseBack,
    searchText = '',
    query,
    savedSearchSource = SchemaTypes.savedSearchSource.DEFAULT,
  } = props.route.params || {};

  const {
    navigation,
    searchModalMode,
    setHandleSearchBack,
    setSearchModalMode,
    setMainFilterOptions,
  } = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);
  const [initialSearchText, setInitialSearchText] = useState();
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
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.canonicalCards);

    return () => {
      setHandleSearchBack(null);
      setSearchModalMode(Constants.searchModalMode.none);
    };
  }, []);

  useEffect(() => {
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.canonicalCards);

    return () => {
      setHandleSearchBack(null);
      setSearchModalMode(Constants.searchModalMode.none);
    };
  }, [initialSearchText, currentSearchText]);

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

  const setNavigationBar = () => {
    const navigationOptions = {};

    if (isCloseBack) {
      const headerLeft = () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      );
      navigationOptions.headerLeft = headerLeft;
    }

    if (searchModalMode) {
      navigationOptions.header = NavBarModalHeader;
      navigationOptions.headerTitle = 'Search For A Card';
    } else {
      navigationOptions.headerTitle = renderSearchBar;
      navigationOptions.headerTitleContainerStyle = styles.headerContainer;
    }

    navigation.setOptions(navigationOptions);
  };

  const handleClose = () => {
    navigation.goBack();
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
      style={[styles.searchBarContainer, searchModalMode ? styles.modalSearchBar : {}]}
      placeholder="Search all cards"
      defaultValue={initialSearchText}
      searchValue={currentSearchText}
      onChangeText={handleChangeSearch}
      onDelete={handleDeleteSearch}
      onCancel={handleCancelSearch}
    />
  );

  const renderContent = () => (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          {searchModalMode ? renderSearchBar() : null}
          <HorizontalScrollFilters />
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <CanonicalSearchResult
              {...props}
              queryOptions={refreshedQueryOptions}
              searchText={currentSearchText}
              savedSearchSource={savedSearchSource}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );

  if (searchModalMode) {
    return (
      <BottomSheetModalProvider>
        {renderContent()}
      </BottomSheetModalProvider>
    );
  }

  return renderContent();
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
  modalSearchBar: {
    marginBottom: 5,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
}));

export default withSearch(DatabaseSearchAllResultPage);
