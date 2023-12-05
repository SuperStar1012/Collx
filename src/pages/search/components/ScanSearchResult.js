import React, {Suspense, useCallback, useState, useEffect} from 'react';
import {View} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  SearchBar,
} from 'components';
import HorizontalScrollFilters from './HorizontalScrollFilters';
import CanonicalSearchResult from './CanonicalSearchResult';

import {createUseStyle} from 'theme';
import {wp} from 'utils';
import {SchemaTypes} from 'globals';
import {withSearch} from 'store/containers';

const ScanSearchResult = (props) => {
  const {
    searchText,
  } = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);
  const [currentSearchText, setCurrentSearchText] = useState(searchText || '')

  useEffect(() => {
    setCurrentSearchText(searchText);
  }, [searchText]);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const handleChangeSearch = value => {
    setCurrentSearchText(value);
  };

  const handleDeleteSearch = () => {
    setCurrentSearchText('');
  };

  const handleCancelSearch = () => {
    setCurrentSearchText('');
  };

  return (
    <View style={styles.container}>
      <ErrorBoundaryWithRetry
        onRetry={handleRefresh}
        fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
        <SearchBar
          style={styles.searchBarContainer}
          placeholder="Search all cards"
          onChangeText={handleChangeSearch}
          onDelete={handleDeleteSearch}
          onCancel={handleCancelSearch}
        />
        <HorizontalScrollFilters />
        <Suspense fallback={<LoadingIndicator isLoading />}>
          <CanonicalSearchResult
            {...props}
            searchText={currentSearchText}
            savedSearchSource={SchemaTypes.savedSearchSource.CAMERA}
            queryOptions={refreshedQueryOptions}
          />
        </Suspense>
      </ErrorBoundaryWithRetry>
    </View>
  );
};

const useStyle = createUseStyle(() => ({
  container: {
    flex: 1,
    width: wp(100),
  },
  searchBarContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
}));

export default withSearch(ScanSearchResult);
