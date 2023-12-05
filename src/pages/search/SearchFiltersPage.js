import React, {
  Suspense,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {View, FlatList} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {
  NavBarModalHeader,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  NavBarButton,
} from 'components';
import SearchFilterItem from './components/SearchFilterItem';
import FilterChangeSheet from './components/FilterChangeSheet';

import {Styles, SearchFilterOptions} from 'globals';
import {withSearch} from 'store/containers';
import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {getFilterOptions} from 'utils';

const SearchFiltersPage = (props) => {
  const styles = useStyle();
  const {navigation, searchModalMode} = props;

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

  const renderContent = () => (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              queryOptions={refreshedQueryOptions}
              {...props}
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

const Content = ({
  navigation,
  searchModalMode,
  selectedCategory,
  mainFilterOptions,
  setSearchCategory,
  setMainFilterOptions,
}) => {
  const filterOptions = mainFilterOptions;
  const styles = useStyle();

  const [isVisibleChangeSheet, setIsVisibleChangeSheet] = useState(false);
  const currentFilter = useRef(null);

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    const navigationOptions = {};

    if (searchModalMode) {
      navigationOptions.header = NavBarModalHeader;
    }

    navigation.setOptions({
      ...navigationOptions,
      headerRight: () => (
        <NavBarButton
          label="Reset All"
          onPress={handleResetAll}
        />
      ),
    });
  };

  const filterData = useMemo(() => {
    if (!filterOptions) {
      return [];
    }

    if (selectedCategory) {
      const mixValues = getFilterOptions(filterOptions, [{
        name: SearchFilterOptions.filterNames.category,
        value: selectedCategory.value}],
      );
      return mixValues.filterOptions;
    }

    return filterOptions;
  }, [filterOptions, selectedCategory]);

  const handleResetAll = () => {
    const options = filterOptions?.map(item => {
      const option = {...item};
      delete option.value;

      // extra
      if (option.name === SearchFilterOptions.filterNames.category) {
        setSearchCategory(null);
      }

      return option;
    });

    setMainFilterOptions(options);
  };

  const handleSelect = item => {
    currentFilter.current = item;
    setIsVisibleChangeSheet(true);
  };

  const handleCloseSheet = () => {
    currentFilter.current = null;
    setIsVisibleChangeSheet(false);
  };

  const handleApplyFilters = (selectedOption) => {
    const mixValues = getFilterOptions(filterOptions, selectedOption, selectedCategory?.value);

    if (mixValues.categoryOption) {
      setSearchCategory(mixValues.categoryOption);
    }

    setMainFilterOptions(mixValues.filterOptions);
  };

  const handleClearFilters = (selectedOption) => {
    const mixValues = getFilterOptions(filterOptions, selectedOption, selectedCategory?.value);

    if (mixValues.categoryOption) {
      setSearchCategory(mixValues.categoryOption);
    }

    setMainFilterOptions(mixValues.filterOptions);
  };

  const renderItem = ({item}) => (
    <SearchFilterItem
      filter={item}
      onPress={handleSelect}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight}}
        data={filterData || []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <FilterChangeSheet
        isVisible={isVisibleChangeSheet}
        filter={currentFilter.current}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={handleCloseSheet}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default withSearch(SearchFiltersPage);
