import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  ErrorBoundaryWithRetry,
  ErrorView,
  LoadingIndicator,
  SearchBar,
  KeyboardAvoidingScrollView,
} from 'components';
import UsersSearchResult from './components/UsersSearchResult';
import FriendsSearch from './components/FriendsSearch';
import FeaturedUsersSearch from './components/FeaturedUsersSearch';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {createUseStyle} from 'theme';
import {SearchFilterOptions} from 'globals';
import {withSearch} from 'store/containers';
import {decodeQuery} from 'utils';

const UsersSearchPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

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
            <Content
              queryOptions={refreshedQueryOptions ?? {}}
              {...props}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({
  navigation,
  setMainFilterOptions,
  route,
}) => {
  const styles = useStyle();
  const {params} = route;

  const [initialSearchText, setInitialSearchText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const queryData = useLazyLoadQuery(graphql`
    query UsersSearchPageQuery {
      viewer {
        profile {
          ...FriendsSearch_profile
        }
        recommendations {
          ...FeaturedUsersSearch_recommendations
        }
        ...FollowButton_viewer
      }
    }`,
    {},
  );

  useEffect(() => {
    if (!params?.query) {
      return;
    }
    setInitialSearchText(decodeQuery(params.query));
    setSearchText(decodeQuery(params.query));
    setIsSearchMode(true);
  }, [params?.query]);

  useEffect(() => {
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.users);
  }, []);

  useEffect(() => {
    setNavigationBar();

    setMainFilterOptions(SearchFilterOptions.users);
  }, [initialSearchText, searchText]);

  if (!queryData) {
    return null;
  }

  const setNavigationBar = () => {
    const navigationOptions = {};

    navigationOptions.headerTitle = renderSearchBar;
    navigationOptions.headerTitleContainerStyle = styles.headerContainer;

    navigation.setOptions(navigationOptions);
  };

  const handleChangeSearch = value => {
    setSearchText(value);
  };

  const handleCancelSearch = () => {
    setIsSearchMode(false);
    setSearchText('');
  };

  const handleDeleteSearch = () => {
    setSearchText('');
  };

  const handleFocusSearch = () => {
    setIsSearchMode(true);
  };

  const renderSearchBar = () => (
    <SearchBar
      style={styles.searchBarContainer}
      placeholder="Search all users"
      defaultValue={searchText}
      searchValue={initialSearchText}
      onChangeText={handleChangeSearch}
      onDelete={handleDeleteSearch}
      onCancel={handleCancelSearch}
      onFocus={handleFocusSearch}
    />
  );

  if (isSearchMode) {
    return (
      <UsersSearchResult
        searchText={searchText}
      />
    );
  }

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <FriendsSearch
        viewer={queryData.viewer}
        profile={queryData.viewer.profile}
      />
      <FeaturedUsersSearch
        viewer={queryData.viewer}
        recommendations={queryData.viewer.recommendations}
      />
    </KeyboardAvoidingScrollView>
  );
};

export default withSearch(UsersSearchPage);

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
}));
