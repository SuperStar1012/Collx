import React, {useMemo, Suspense, useState, useCallback, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';

import {
  ErrorBoundaryWithRetry,
  ErrorView,
  LoadingIndicator,
  FooterIndicator,
  KeyboardAvoidingFlatList,
} from 'components';
import UsersSearchItem from './UsersSearchItem';
import HorizontalScrollFilters from './HorizontalScrollFilters';

import {Constants, SearchFilterOptions} from 'globals';
import {useActions} from 'actions';
import {createUseStyle, Fonts} from 'theme';
import {withSearch} from 'store/containers';

const UsersSearchResult = (props) => {
  const {searchText} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  return (
    <View style={styles.container}>
      <ErrorBoundaryWithRetry
        onRetry={handleRefresh}
        fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
        <HorizontalScrollFilters />
        <Suspense fallback={<LoadingIndicator isLoading />}>
          <MainContent
            {...props}
            searchText={searchText}
            queryOptions={refreshedQueryOptions ?? {}}
          />
        </Suspense>
      </ErrorBoundaryWithRetry>
    </View>
  );
};

const MainContent = (props) => {
  const {
    searchText,
    mainFilterOptions,
    queryOptions,
  } = props;

  const getBooleanValue = (optionValue) => {
    if (optionValue === SearchFilterOptions.filterValues.yes) {
      return true;
    } else if (optionValue === SearchFilterOptions.filterValues.no) {
      return false;
    }

    return null;
  };

  const withOptions = useMemo(() => {
    const options = {};

    if (!mainFilterOptions?.length) {
      return options;
    }

    mainFilterOptions.map(option => {
      const value = getBooleanValue(option.value);

      if (value === null) {
        return;
      }

      switch (option.name) {
        case SearchFilterOptions.filterNames.acceptingOffers:
          options.isAcceptingOffers = value;
          break;
        case SearchFilterOptions.filterNames.sellerDiscount:
          options.isDiscountingForQuantity = value;
          break;
        case SearchFilterOptions.filterNames.freeShipping: {
          options.isShippingFree = value;
          break;
        }
      }
    });

    return options;
  }, [mainFilterOptions]);

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
    query UsersSearchResultQuery(
      $keywords: String!,
      $orderBy: [SearchProfilesOrder!],
      $withOption: SearchProfilesWith!
    ) {
      search(keywords: $keywords) {
        ...UsersSearchResult_search @arguments(orderBy: $orderBy, withOption: $withOption)
      }
      viewer {
        ...FollowButton_viewer
      }
    }`,
    {
      keywords: searchText || '',
      orderBy: orderByOptions,
      withOption: withOptions,
    },
    queryOptions,
  );

  if (!searchText && !Object.keys(withOptions).length) {
    return null;
  }

  return (
    <Content
      {...props}
      keyword={searchText}
      viewer={searchData.viewer}
      search={searchData.search}
    />
  );
};

const Content = ({
  keyword,
  viewer,
  search,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const keyboardAvoidFlatListRef = useRef(null);

  const {data: profilesData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment UsersSearchResult_search on Search
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[SearchProfilesOrder!]"}
      withOption: {type: "SearchProfilesWith"}
    )
    @refetchable(queryName: "UsersSearchResultPaginationQuery") {
      profiles(after: $after, first: $first, orderBy: $orderBy, with: $withOption)
      @connection(key: "UsersSearchResult_search__profiles") {
        count
        edges {
          node {
            ...UsersSearchItem_profile
          }
        }
      }
    }`,
    search,
  );

  const {profiles} = profilesData || {};

  const profilesCount = useMemo(() => (
    `${profiles?.count || 0}${profiles?.count >= 1000 ? '+' : ''} User${profiles?.count > 1 ? 's' : ''} found`
  ), [profiles?.count]);

  useEffect(() => {
    if (!keyboardAvoidFlatListRef.current) {
      return;
    }

    keyboardAvoidFlatListRef.current.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [keyword]);

  if (!profiles) {
    return null;
  }

  const handleRefresh = () => {
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

  const handleSelectUser = profileId => {
    actions.pushProfile(profileId);
  };

  const renderItem = ({item: edge}) => (
    <UsersSearchItem
      profile={edge.node}
      viewer={viewer}
      onPress={handleSelectUser}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        {profilesCount}
      </Text>
      <KeyboardAvoidingFlatList
        ref={keyboardAvoidFlatListRef}
        data={profiles?.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        refreshing={false}
        onEndReachedThreshold={0.2}
        onEndReached={handleEndReached}
      />
    </View>
  );
};

export default withSearch(UsersSearchResult);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
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
  },
}));
