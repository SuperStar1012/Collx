import React, {Suspense, useRef, useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  SectionList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useDrawerStatus} from '@react-navigation/drawer';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SortFilterItem from './components/SortFilterItem';

import {Constants, Styles} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {withSortFilter} from 'store/containers';

const chevronLeftIcon = require('assets/icons/chevron_backward.png');

const sortData = {
  title: Constants.cardSortFilterCategory.sort,
  data: Object.values(Constants.cardSorts),
};

const allSet = {
  id: -1,
  name: Constants.cardFilterAllSets,
};

const SortFilterPage = (props) => {
  const styles = useStyle();

  const [queryOptions, setQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  return (
    <View style={styles.container}>
      <ErrorBoundaryWithRetry
        onRetry={handleRefresh}
        fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
        <Suspense fallback={<LoadingIndicator isLoading />}>
          <Content
            {...props}
            queryOptions={queryOptions}
          />
        </Suspense>
      </ErrorBoundaryWithRetry>
    </View>
  );
};

const Content = props => {
  const {
    navigation,
    state,
    drawerOpenMode,
    cardFilters,
    queryOptions,
    setSort,
    setFilter,
    setEnabledPreserveSettings,
  } = props;

  const {routes} = state;

  const styles = useStyle();

  const viewerData = useLazyLoadQuery(graphql`
    query SortFilterPageQuery {
      viewer {
        profile {
          id
        }
      }
    }`,
    {},
    queryOptions,
  );

  const {profile} = viewerData.viewer || {};

  // For current user or other user
  const currentRoute = routes.find(route => route?.name === 'Collection');
  const profileId = currentRoute?.params?.profileId || profile.id;
  const isCurrentUser = !currentRoute?.params?.profileId;

  const currentCardFilters = cardFilters[profileId];
  const displayMode = drawerOpenMode[profileId];

  const pageViewRef = useRef(null);
  const currentFiltersRef = useRef({});

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [filterName, setFilterName] = useState(null);
  const [filterItems, setFilterItems] = useState([]);
  const [setItems, setSetItems] = useState([]);

  const isDrawerOpen = useDrawerStatus() === 'open';

  const filterData = useMemo(() => {
    const data = Object.values(Constants.cardFilters);
    if (isCurrentUser) {
      data.unshift(Constants.cardFeature.featured);
    }

    return ({
      title: Constants.cardSortFilterCategory.filter,
      data,
    });
  }, [isCurrentUser]);

  const rootItems = useMemo(() => {
    if (displayMode === Constants.cardSortFilterDisplay.sort) {
      return [sortData];
    } else if (displayMode === Constants.cardSortFilterDisplay.filter) {
      return [filterData];
    }

    return [sortData, filterData];
  }, [displayMode, filterData, sortData]);

  useEffect(() => {
    if (isDrawerOpen && pageViewRef.current && currentPageIndex > 0) {
      pageViewRef.current.setPage(0);
      setCurrentPageIndex(0);
      setFilterName(null);
      setFilterItems([]);
      setSetItems([]);
    }
  }, [isDrawerOpen]);

  const setSets = value => {
    if (!filterName) {
      return;
    }

    if (typeof value === 'object') {
      value = value.name;
    }

    const title = `${filterName.label} / ${value}`;
    if (!currentCardFilters?.sets || !currentCardFilters?.sets.length) {
      setSetItems([
        {
          title,
          data: [allSet],
        },
      ]);
      return;
    }

    const filteredSets = currentCardFilters?.sets.filter(set =>
      set.name.includes(value),
    );

    setSetItems([
      {
        title,
        data: [allSet, ...filteredSets],
      },
    ]);
  };

  const goNextPage = () => {
    if (pageViewRef.current && currentPageIndex < 2) {
      pageViewRef.current.setPage(currentPageIndex + 1);
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handleGoBack = () => {
    if (currentPageIndex === 0) {
      navigation.closeDrawer();
      return;
    }

    if (pageViewRef.current && currentPageIndex > 0) {
      pageViewRef.current.setPage(currentPageIndex - 1);
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSelectMainItem = (category, item) => {
    if (category === Constants.cardSortFilterCategory.sort) {
      // Sort
      setSort({profileId, sort_by: item.value});
      navigation.closeDrawer();
      return;
    }

    // Filter
    if (
      item.label === Constants.cardFilters.unidentified.label ||
      item.label === Constants.cardFilters.sale.label ||
      item.label === Constants.cardFilters.sold.label ||
      item.label === Constants.cardFeature.featured.label
    ) {
      currentFiltersRef.current = {
        [item.value]: true,
      };
    } else {
      if (currentPageIndex === 0) {
        let data = [];
        switch (item.label) {
          case Constants.cardFilters.team.label:
            data = currentCardFilters?.teams || [];
            break;
          case Constants.cardFilters.year.label:
            data = currentCardFilters?.years || [];
            break;
          case Constants.cardFilters.condition.label:
            data = Constants.cardConditions.map(condition => condition.long);
            break;
          case Constants.cardFilters.graded.label:
            data = Object.keys(Constants.gradedOptions).map(option => option);
            break;
        }

        setFilterName(item);
        setFilterItems([
          {
            title: `${item.label} To ${Constants.cardSortFilterCategory.filter}`,
            data,
          },
        ]);

        goNextPage();
        return;
      } else if (currentPageIndex === 1) {
        switch (filterName.label) {
          case Constants.cardFilters.year.label: {
            currentFiltersRef.current = {
              [filterName.value]: item,
            };
            setSets(item);
            goNextPage();
            return;
          }
          case Constants.cardFilters.team.label:
            currentFiltersRef.current = {
              [filterName.value]: item.name,
            };
            break;
          case Constants.cardFilters.condition.label:
            currentFiltersRef.current = {
              [filterName.value]: item,
            };
            break;
          case Constants.cardFilters.graded.label:
            currentFiltersRef.current = {
              [filterName.value]: Constants.gradedOptions[item].label,
            };
            break;
        }
      } else {
        // Set
        if (item.id > -1) {
          currentFiltersRef.current = {
            ...currentFiltersRef.current,
            set: item.name,
          };
        }
      }
    }

    if (isCurrentUser) {
      setEnabledPreserveSettings(true);
    }

    setFilter({profileId, filter_by: currentFiltersRef.current});
    currentFiltersRef.current = {};

    navigation.closeDrawer();
    return;
  };

  const renderSectionHeader = (pageIndex, section) => (
    <TouchableOpacity
      style={styles.sectionHeaderContainer}
      activeOpacity={0.9}
      onPress={() => handleGoBack()}>
      {pageIndex > 0 ? (
        <Image style={styles.iconChevronLeft} source={chevronLeftIcon} />
      ) : null}
      <Text style={styles.textSectionHeaderTitle} numberOfLines={1}>
        {section.title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = (pageIndex, title, item) => {
    let value = item;
    if (typeof item === 'object') {
      value = item.name || item.label;
    }

    return (
      <SortFilterItem
        textStyle={pageIndex === 0 ? styles.textItem : {}}
        title={value}
        onPress={() => handleSelectMainItem(title, item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pageViewRef}
        style={[
          styles.pageViewContainer,
          {marginTop: Styles.screenSafeTopHeight + 6},
        ]}
        scrollEnabled={false}>
        <SectionList
          contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight}}
          sections={rootItems}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({section}) => renderSectionHeader(0, section)}
          renderItem={({item, section}) => renderItem(0, section.title, item)}
        />
        <SectionList
          contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight}}
          sections={filterItems}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({section}) => renderSectionHeader(1, section)}
          renderItem={({item, section}) => renderItem(1, section.title, item)}
        />
        <SectionList
          contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight}}
          sections={setItems}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({section}) => renderSectionHeader(2, section)}
          renderItem={({item, section}) => renderItem(2, section.title, item)}
          // onEndReachedThreshold={0.2}
          // onEndReached={() => handleEndReachedSetItems()}
        />
      </PagerView>
    </View>
  );
};

export default withSortFilter(SortFilterPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryCardBackground,
  },
  pageViewContainer: {
    flex: 1,
  },
  sectionHeaderContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.tertiaryCardBackground,
  },
  textSectionHeaderTitle: {
    fontWeight: Fonts.bold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textTransform: 'uppercase',
  },
  iconChevronLeft: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 4,
    tintColor: colors.primaryText,
  },
  textItem: {
    fontSize: 15,
    lineHeight: 18,
  },
}));
