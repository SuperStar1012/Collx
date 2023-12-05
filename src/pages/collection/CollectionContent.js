import React, {useEffect, useRef, useState, Suspense, useMemo, useCallback} from 'react';
import {
  View,
  Animated,
  Image,
  Alert,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {useScrollToTop} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/elements';
import _ from 'lodash';
import {graphql, useFragment} from 'react-relay';
import {useFocusEffect} from '@react-navigation/native';

import {
  NavBarButton,
  LoadingIndicator,
  CollectionGuide,
  SortFilterList,
  UserView,
} from 'components';

import GridViewContainer from './components/GridViewContainer';
import ListViewContainer from './components/ListViewContainer';
import CollapseViewContainer from './components/CollapseViewContainer';

import NavigationTitle from './components/NavigationTitle';
import BottomView from './components/BottomView';
import SearchSortFilter from './components/SearchSortFilter';
import CollectionSummaryContainer from './components/CollectionSummaryContainer';
import CollectionSportList from './components/CollectionSportList';
import ScrollTop from './components/ScrollTop';

import {Constants, SchemaTypes, Styles} from 'globals';
import {createUseStyle, useTheme} from 'theme';
import {
  wp,
  getSortLabel,
  getFilterLabel,
  decodeId,
  setStorageItem,
  showErrorAlert,
} from 'utils';
import {withCollection} from 'store/containers';
import {requestInAppReview, analyticsNavigationRoute} from 'services';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'

const addIcon = require('assets/icons/plus.png');
const viewGridIcon = require('assets/icons/grid.png');
const viewListIcon = require('assets/icons/list.png');
const viewSetIcon = require('assets/icons/set.png');
const cartIcon = require('assets/icons/cart.png');

const subTitleHeight = 20;
const subTabBarBottomPadding = 12;
const otherUserMarginTop = 16;

const tabViewKeys = {
  grid: 'grid',
  list: 'list',
  collapse: 'collapse',
};

const defaultFilterOptions = [
  SchemaTypes.tradingCardState.LISTED,
  SchemaTypes.tradingCardState.ACCEPTING_OFFERS,
  SchemaTypes.tradingCardState.NOT_FOR_SALE,
  SchemaTypes.tradingCardState.UNIDENTIFIED,
];

const CollectionContent = ({
  navigation,
  route,
  user,
  userCardsActionCount,
  initialSettings,
  isEnabledPreserveSettings,
  sort,
  filter,
  setSort,
  setFilter,
  setDrawerOpenMode,
  setSearchModalMode,
  setHandleSearchBack,
  getUserCardFilters,
  updateUserCardsCount,
  setEnabledPreserveSettings,
  setEmailVerifiedAction,
  viewer,
  profile,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const initialProfileId = route.params?.profileId ? route.params?.profileId : null;

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
  };

  const viewerData = useFragment(graphql`
    fragment CollectionContent_viewer on Viewer {
      profile {
        id
        type
        isAnonymous
      }
    }`,
    viewer
  );


  const profileData = useFragment(graphql`
    fragment CollectionContent_profile on Profile {
      id
      name
      isAnonymous
      viewer {
        activeDealWithSeller {
          id
          state
        }
      }
      ...CollectionSportList_profile
      ...UserView_profile
    }`,
    profile
  );

  const profileId = initialProfileId || viewerData.profile.id;
  const isCurrentUser = profileId === viewerData.profile.id;
  const [, userId] = decodeId(profileId);
  const {activeDealWithSeller} = profileData.viewer || {};

  const [tabBarIndex, setTabBarIndex] = useState(0);
  const [routes] = useState([
    {key: tabViewKeys.grid, icon: viewGridIcon},
    {key: tabViewKeys.list, icon: viewListIcon},
    {key: tabViewKeys.collapse, icon: viewSetIcon},
  ]);

  // TODO: remove later when we implemented the Add / Edit by graphql
  const [refetchKey, setRefetchKey] = useState(0);

  const actionBottomSheetRef = useRef(null);

  const scrollViewGridRef = useRef(null);
  const scrollViewListRef = useRef(null);
  const scrollViewCollapseRef = useRef(null);

  const [searchText, setSearchText] = useState('');
  const searchInModeRef = useRef(false);

  const [selectMode, setSelectMode] = useState(Constants.collectionSelectMode.none);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentCardTypeRef = useRef(Constants.allUserCardType);
  const [allUserCardTypes, setAllUserCardTypes] = useState([Constants.allUserCardType]);
  const [currentUserCardType, setCurrentUserCardType] = useState(Constants.allUserCardType);
  const [currentSportCount, setCurrentSportCount] = useState(-1);
  const [isOpenCardTypeList, setIsOpenCardTypeList] = useState(false);

  // layout
  const [tabBarHeight, setTabBarHeight] = useState(52);
  const [subTabBarHeight, setSubTabBarHeight] = useState(
    52 + subTabBarBottomPadding,
  );
  const [otherUserHeight, setOtherUserHeight] = useState(
    isCurrentUser ? 0 : 72 + otherUserMarginTop,
  );

  const [isVisibleBottomSheet, setIsVisibleBottomSheet] = useState(false);
  const [scrollOffsets, setScrollOffsets] = useState({});
  const scrollOffsetsRef = useRef({});
  const scrollHeightsRef = useRef({});
  const [animatedScrollValue] = useState(
    new Animated.Value(tabBarHeight + otherUserHeight),
  );

  const debouncedSearchFunc = useRef(null);

  useScrollToTop(scrollViewGridRef);
  useScrollToTop(scrollViewListRef);
  useScrollToTop(scrollViewCollapseRef);

  const currentSort = useMemo(() => sort[profileId] , [sort, profileId]);

  const currentFilter = useMemo(() => filter[profileId], [filter, profileId]);

  const isProUser = useMemo(() => {
    const {type: profileType} = viewerData.profile || {};
    return profileType === Constants.userType.pro;
  }, [viewerData.profile]);

  const isLoggedIn = useMemo(() => (
    Object.keys(user).length > 0
  ), [user]);

  const sortLabel = useMemo(() => (
    getSortLabel(currentSort || {})
  ), [currentSort]);

  const filterLabel = useMemo(() => {
    setScrollOffsets({});
    scrollOffsetsRef.current = {};
    scrollHeightsRef.current = {};

    return getFilterLabel(currentFilter || {});
  }, [currentFilter]);

  const sortOption = useMemo(() => {
    let options = isCurrentUser ? [SchemaTypes.tradingCardOrder.NEWEST_FIRST] : [SchemaTypes.tradingCardOrder.FEATURED];

    if (currentSort?.sort_by) {
      options = [currentSort.sort_by];
    }

    return options;
  }, [currentSort]);

  const filterOption = useMemo(() => {
    const options = {
      states: defaultFilterOptions,
    };

    if (currentUserCardType?.sport && SchemaTypes.sport[currentUserCardType.sport]) {
      options.sport = currentUserCardType.sport;
    } else if (currentUserCardType?.game && SchemaTypes.game[currentUserCardType.game]) {
      options.game = currentUserCardType.game;
    }

    const searchValue = !searchInModeRef.current || (!searchText || searchText.startsWith(' ')) ? null : searchText;

    if (searchValue) {
      options.keywords = searchValue;
    }

    if (!currentFilter || !Object.keys(currentFilter).length) {
      setCurrentSportCount(-1);
      return options;
    }

    if (currentFilter[Constants.cardFilters.sale.value]) {
      options.states = [SchemaTypes.tradingCardState.LISTED];
    } else if (currentFilter[Constants.cardFilters.sold.value]) {
      options.states = [SchemaTypes.tradingCardState.SOLD];
    } else if (currentFilter[Constants.cardFilters.unidentified.value]) {
      options.states = [SchemaTypes.tradingCardState.UNIDENTIFIED];
    } else if (currentFilter[Constants.cardFeature.featured.value]) {
      options.featured = true;
    }

    if (currentFilter[Constants.cardFilters.team.value]) {
      options[Constants.cardFilters.team.value] = {
        name: currentFilter[Constants.cardFilters.team.value],
      };
    } else if (currentFilter[Constants.cardFilters.year.value]) {
      if (currentFilter.set) {
        options.set = {
          name: currentFilter.set,
          year: currentFilter[Constants.cardFilters.year.value],
        };
      } else {
        options[Constants.cardFilters.year.value] = currentFilter[Constants.cardFilters.year.value];
      }
    } else if (currentFilter[Constants.cardFilters.condition.value]) {
      options[Constants.cardFilters.condition.value] = {
        name: currentFilter[Constants.cardFilters.condition.value],
      };
    } else if (currentFilter[Constants.cardFilters.graded.value]) {
      const label = currentFilter[Constants.cardFilters.graded.value];
      const gradedOption = Object.values(Constants.gradedOptions).find(option => option.label === label);

      if (gradedOption) {
        options.isGraded = gradedOption.value;
      }
    }

    setCurrentSportCount(-1);

    return options;
  }, [currentFilter, currentUserCardType, searchText]);

  useEffect(() => {
    // gets card filters
    getUserCardFilters({userId});
  }, []);

  useEffect(() => {
    if (!profileData.tradingCards || !profileData.tradingCards.length) {
      return;
    }

    if (isCurrentUser && profileData.tradingCards.length > Constants.userCardsForAppReview) {
      requestInAppReview();
    }
  }, [profileData.tradingCards]);

  useEffect(() => {
    if (!actionBottomSheetRef.current) {
      return;
    }

    if (selectedCards.length > 0 && tabBarIndex < 2) {
      actionBottomSheetRef.current.snapToIndex(0);
      setIsVisibleBottomSheet(true);
    } else {
      actionBottomSheetRef.current.close();
      setIsVisibleBottomSheet(false);
    }
  }, [selectedCards, tabBarIndex]);

  useEffect(() => {
    setNavigationBar();
  }, [
    profileData,
    selectMode,
    tabBarIndex,
    currentSportCount,
    isOpenCardTypeList,
    currentFilter,
  ]);

  useEffect(() => {
    if (userCardsActionCount > 0) {
      setRefetchKey((prev) => prev + 1);
    }
  }, [userCardsActionCount]);

  // For preserve category / filter settings
  useFocusEffect(
    useCallback(() => {
      return () => {
        setEnabledPreserveSettings(false);
      }
    }, [])
  );

  useEffect(() => {
    if (!isCurrentUser) {
      return;
    }

    if (!initialSettings) {
      return;
    }

    if (initialSettings.filter && !_.isEqual(filter[profileId], initialSettings.filter)) {
      setFilter({profileId, filter_by: initialSettings.filter});
    }

    if (initialSettings.category && !_.isEqual(currentCardTypeRef.current, initialSettings.category)) {
      currentCardTypeRef.current = initialSettings.category;
      setCurrentUserCardType(initialSettings.category);
    }
  }, [initialSettings]);

  useEffect(() => {
    if (!isCurrentUser || !isEnabledPreserveSettings) {
      return;
    }

    const collectionSettings = {
      category: currentUserCardType || Constants.allUserCardType,
      filter: currentFilter || {},
    };

    setStorageItem(Constants.collectionSettings, collectionSettings);
  }, [isEnabledPreserveSettings, currentUserCardType, currentFilter]);

  const setNavigationBar = () => {
    const renderHeader = {};
    let isHasTwoRightButtons = false;

    if (isCurrentUser) {
      if (selectMode === Constants.collectionSelectMode.none && currentSportCount > 0) {
        renderHeader.headerRight = () => (
          <NavBarButton
            style={styles.navBarAddButton}
            icon={addIcon}
            onPress={handleAdd}
          />
        );
      } else {
        renderHeader.headerRight = () => null;
      }

      if (tabBarIndex < 2 && currentSportCount > 0) {
        renderHeader.headerLeft = () => (
          <NavBarButton
            style={styles.navBarButton}
            label={selectMode === Constants.collectionSelectMode.none ? 'Select' : 'Cancel'}
            scaleDisabled={true}
            onPress={handleSelectCurrentCards}
          />
        );
      } else {
        renderHeader.headerLeft = () => null;
      }
    } else {
      renderHeader.headerLeft = () => (
        <HeaderBackButton
          labelVisible={false}
          onPress={() => navigation.goBack()}
        />
      );

      if (!profileData.isAnonymous && tabBarIndex < 2 && currentSportCount > 0) {
        isHasTwoRightButtons = !!activeDealWithSeller;

        renderHeader.headerRight = () => (
          <View style={styles.navBarRightContainer}>
            <NavBarButton
              style={styles.navBarButton}
              label={selectMode === Constants.collectionSelectMode.none ? 'Select' : 'Cancel'}
              scaleDisabled={true}
              onPress={handleSelectOtherCards}
            />
            {activeDealWithSeller ? (
              <NavBarButton
                style={styles.navBarIconButton}
                icon={cartIcon}
                onPress={() => actions.navigateDeal(activeDealWithSeller?.id)}
              />
            ) : null}
          </View>
        );
      } else {
        renderHeader.headerRight = () => null;
      }
    }

    navigation.setOptions({
      title: (
        <NavigationTitle
          style={isHasTwoRightButtons ? styles.shortTitleContainer : {}}
          title={currentUserCardType?.label}
          isEnabledDropdown={currentSportCount > 0 || Object.keys(currentFilter || {}).length > 0}
          isOpen={isOpenCardTypeList}
          onPress={handleOpenCardTypeList}
        />
      ),
      ...renderHeader,
    });
  };

  const addTradingCardsToDeal = () => {
    setIsUpdating(true);

    actions.addTradingCardsToDeal(
      profileId,
      selectedCards,
      {
        onComplete: (deal) => {
          setIsUpdating(false);

          actions.navigateDeal(deal?.id);
        },
        onError: (error) => {
          console.log(error);

          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      }
    );

    handleResetSelection();
  };

  const pinFeatureCards = tradingCardIds => {
    if (!isProUser) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.Collection,
      });
      return;
    }

    setIsUpdating(true);

    actions.markTradingCardAsFeatured(
      tradingCardIds,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const pinUnfeatureCards = tradingCardIds => {
    if (!isProUser) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.Collection,
      });
      return;
    }

    setIsUpdating(true);

    actions.markTradingCardAsUnfeatured(
      tradingCardIds,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleOpenCardTypeList = () => {
    setIsOpenCardTypeList(!isOpenCardTypeList);
  };

  const handleChangeUserCardCount = item => {
    setCurrentSportCount(item.count);
  };

  const handleSelectCardType = (item, isListAction = false) => {
    if (isCurrentUser) {
      setEnabledPreserveSettings(true);
    }

    setCurrentUserCardType(item);

    if (isListAction) {
      handleOpenCardTypeList();
    }

    if (currentCardTypeRef.current?.value !== item.value) {
      currentCardTypeRef.current = item;
      setTimeout(() => {
        handleResetSelection();
      }, 10);
    }
  };

  const handleChangeAllCardTypes = (allCardTypes) => {
    setAllUserCardTypes(allCardTypes);
  };

  const handleStartScan = () => {
    navigation.navigate('CameraStackModal');
  };

  const handleSelectCurrentCards = () => {
    if (selectMode === Constants.collectionSelectMode.none) {
      setSelectMode(Constants.collectionSelectMode.currentUser);
    } else {
      setSelectMode(Constants.collectionSelectMode.none);
    }

    setSelectedCards([]);
  }

  const handleSelectOtherCards = () => {
    if (selectMode === Constants.collectionSelectMode.none) {
      setSelectMode(Constants.collectionSelectMode.otherUser);
    } else {
      setSelectMode(Constants.collectionSelectMode.none);
    }

    setSelectedCards([]);
  };

  const handleAdd = () => {
    // Add card
    const handleBackSearch = canonicalCardId => {
      if (!canonicalCardId) {
        return;
      }

      actions.navigateAddCardToCollection({
        canonicalCardId,
        isCloseBack: false,
      });
    };

    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.edit);

    actions.navigateSearchDatabaseCardsModal({
      isCloseBack: true,
      savedSearchSource: SchemaTypes.savedSearchSource.COLLECTION,
    });
  };

  const handleResetSelection = () => {
    setSelectedCards([]);
    setSelectMode(Constants.collectionSelectMode.none);
  };

  const handleScroll = (tab, offset) => {
    if (scrollOffsetsRef.current[tab] !== offset) {
      scrollOffsetsRef.current[tab] = offset;

      setScrollOffsets({...scrollOffsetsRef.current});
    }

    if (offset < 0) {
      animatedScrollValue.setValue(tabBarHeight + otherUserHeight);
    } else {
      animatedScrollValue.setValue(tabBarHeight + otherUserHeight - offset);
    }
  };

  const handleLayout = (tab, layout) => {
    scrollHeightsRef.current[tab] = layout.height;
  };

  const handleScrollToTop = () => {
    const currentKey = routes[tabBarIndex].key;

    switch (currentKey) {
      case tabViewKeys.grid:
        if (scrollViewGridRef.current) {
          scrollViewGridRef.current.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            viewPosition: 1,
          });
        }
        break;
      case tabViewKeys.list:
        if (scrollViewListRef.current) {
          scrollViewListRef.current.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            viewPosition: 1,
          });
        }
        break;
      case tabViewKeys.collapse:
        if (scrollViewCollapseRef.current) {
          scrollViewCollapseRef.current.scrollTo({
            x: 0,
            y: 0,
            animated: true,
          });
        }
        break;
    }
  };

  const handleLayoutTabBar = event => {
    const layout = event.nativeEvent.layout;
    const height = Math.round(layout.height);

    if (height !== tabBarHeight) {
      setTabBarHeight(height);
    }
  };

  const handleLayoutSubTabBar = event => {
    const layout = event.nativeEvent.layout;
    const height = Math.round(layout.height);

    if (height !== subTabBarHeight - subTabBarBottomPadding) {
      animatedScrollValue.setValue(tabBarHeight + otherUserHeight);

      setSubTabBarHeight(height + subTabBarBottomPadding);
    }
  };

  const handleLayoutOtherUser = layout => {
    const userHeight = layout.height + otherUserMarginTop;

    if (userHeight !== otherUserHeight) {
      setOtherUserHeight(userHeight);
      animatedScrollValue.setValue(tabBarHeight + userHeight);
    }
  };

  const handleChangeTabBarIndex = index => {
    setTabBarIndex(index);

    const tabKey = Object.keys(tabViewKeys)[index];

    animatedScrollValue.setValue(
      otherUserHeight + tabBarHeight - (scrollOffsetsRef.current[tabKey] || 0),
    );
  };

  const handleSelectItem = tradingCard => {
    const tradingCardId = tradingCard?.id;

    if (selectMode === Constants.collectionSelectMode.none || tabBarIndex > 1) {
      actions.pushTradingCardDetail(tradingCardId);
      return;
    }

    const isExisting = selectedCards.findIndex(cardId => cardId === tradingCardId) > -1;

    if (isExisting) {
      setSelectedCards(selectedCards.filter(cardId => cardId !== tradingCardId));
    } else {
      selectedCards.push(tradingCardId);
      setSelectedCards([...selectedCards]);
    }
  };

  const handleClearSortOrFilter = removableItem => {
    if (!removableItem) {
      setSort({profileId, sort_by: null});
      setFilter({profileId, filter_by: {}});
      return;
    }

    if (removableItem.category === Constants.cardSortFilterCategory.sort) {
      setSort({profileId, sort_by: null});
    } else if (
      removableItem.category === Constants.cardSortFilterCategory.filter
    ) {
      setFilter({profileId, filter_by: {}});
    }
  };

  const handleSearchText = text => {
    if (debouncedSearchFunc.current) {
      debouncedSearchFunc.current.cancel();
    }

    debouncedSearchFunc.current = _.debounce(() => {
      debouncedSearchFunc.current = null;
      setSearchText(text);
    },
    500,
    {
      leading: false,
      trailing: true,
    });

    debouncedSearchFunc.current();
  };

  const handleChangeSearchInMode = (searchMode) => {
    searchInModeRef.current = searchMode;
  };

  const handleSortAndFilter = () => {
    let drawerOpenMode = Constants.cardSortFilterDisplay.both;

    if (tabBarIndex > 1) {
      drawerOpenMode = Constants.cardSortFilterDisplay.filter;
    }

    setDrawerOpenMode({
      profileId,
      drawerOpenMode,
    });

    navigation.openDrawer();
  };

  const handleRemoveCards = () => {
    if (!selectedCards?.length) {
      return;
    }

    setIsUpdating(true);

    const filters = {
      orderBy: sortOption,
      with: filterOption,
    };

    actions.deleteTradingCards(
      selectedCards,
      filters,
      {
        onComplete: () => {
          setIsUpdating(false);
          // setRefetchKey((prev) => prev + 1);
          updateUserCardsCount();
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );

    handleResetSelection();
  };

  const handleAddCardsToDeal = () => {
    if (selectedCards.length) {
      if (!activeDealWithSeller || activeDealWithSeller.state === SchemaTypes.dealState.PENDING) {
        addTradingCardsToDeal();
        return;
      }

      Alert.alert(
        'Are you sure to revert your active deal to pending?',
        'There’s an ongoing deal between this seller and you. Adding more cards to the deal will revert the deal to pending and you need to send a new offer.',
        [
          {
            text: 'Yes',
            onPress: addTradingCardsToDeal,
          },
          {
            text: 'No',
            onPress: handleResetSelection,
          },
        ],
      );
    }
  };

  const handlePinFeature = tradingCardId => {
    if (tradingCardId) {
      pinFeatureCards([tradingCardId]);
    }
  };

  const handlePinUnfeature = tradingCardId => {
    if (tradingCardId) {
      pinUnfeatureCards([tradingCardId]);
    }
  };

  const handlePinFeatureCards = () => {
    if (selectedCards.length) {
      pinFeatureCards(selectedCards);
    }

    handleResetSelection();
  };

  const handlePinUnfeatureCards = () => {
    if (selectedCards.length) {
      pinUnfeatureCards(selectedCards);
    }

    handleResetSelection();
  };

  const handleProfile = () => {
    if (!initialProfileId) {
      navigation.navigate('Profile');
    } else {
      navigation.push('Profile', {
        profileId,
      });
    }
  };

  const handleMessage = async () => {
    if (viewerData.profile.isAnonymous) {
      actions.navigateCreateAccount();
      return;
    }

    setEmailVerifiedAction(() => {
      actions.navigateMessage({
        currentProfileId: viewerData.profile.id,
        peerProfileId: initialProfileId,
      });
    });
  };

  const renderTabBarIcon = ({route, color}) => (
    <Image
      source={route.icon}
      style={[styles.iconTabBar, {tintColor: color}]}
    />
  );

  const renderTabBar = tabBarProps => (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.tabBarMainContainer,
        {
          height:
            tabBarHeight +
            subTabBarHeight +
            otherUserHeight -
            subTabBarBottomPadding,
        },
      ]}>
      <View style={styles.tabBarWrapper} onLayout={handleLayoutTabBar}>
        <TabBar
          {...tabBarProps}
          style={styles.tabBarContainer}
          activeColor={colors.primary}
          inactiveColor={colors.lightGrayText}
          indicatorContainerStyle={styles.tabBarIndicatorContainer}
          indicatorStyle={styles.tabBarIndicator}
          renderIcon={renderTabBarIcon}
        />
      </View>
      {renderSubTabBar()}
    </Animated.View>
  );

  const renderSubTabBar = () => (
    <Animated.View
      style={[styles.tabBarSubContainer, {top: animatedScrollValue}]}
      onLayout={handleLayoutSubTabBar}>
      <SearchSortFilter
        defaultValue={searchText}
        editable={selectMode === Constants.collectionSelectMode.none}
        onChangeSearch={handleSearchText}
        onChangeSearchInMode={handleChangeSearchInMode}
        onOpenSortAndFilter={handleSortAndFilter}
      />
      <SortFilterList
        sort={tabBarIndex < 2 ? sortLabel : null}
        filter={filterLabel}
        onClear={handleClearSortOrFilter}
      />
    </Animated.View>
  );

  const renderOtherUser = () => {
    if (isCurrentUser) {
      return null;
    }

    return (
      <UserView
        style={[
          styles.userInfoContainer,
          {top: tabBarHeight + otherUserMarginTop},
        ]}
        profile={profileData}
        isVisibleMessage={!isCurrentUser}
        onMessage={handleMessage}
        onLayout={handleLayoutOtherUser}
        onPress={handleProfile}
      />
    );
  };

  const renderScrollToTop = () => {
    const currentKey = routes[tabBarIndex].key;
    const marginBottom = isVisibleBottomSheet ? Styles.collectionActionBarHeight + Styles.collectionActionBarMarginBottom : 0;

    return (
      <ScrollTop
        offset={scrollOffsets[currentKey] || 0}
        height={scrollHeightsRef.current[currentKey] || 0}
        marginBottom={marginBottom}
        subTitleHeight={subTitleHeight}
        onPress={handleScrollToTop}
      />
    );
  };

  const renderScene = ({route}) => {
    if (!isLoggedIn) {
      return null;
    }

    switch (route.key) {
      case tabViewKeys.grid:
        return (
          <GridViewContainer
            style={[
              {marginTop: tabBarHeight},
              selectedCards.length > 0 ? styles.tabContentContainer : {},
            ]}
            contentContainerStyle={{
              paddingTop: subTabBarHeight + otherUserHeight,
            }}
            profileId={initialProfileId}
            sortOption={sortOption}
            filterOption={filterOption}
            sortLabel={sortLabel}
            categoryLabel={!isCurrentUser ? currentUserCardType?.label : null}
            selectMode={selectMode}
            selectedCards={selectedCards}
            refetchKey={refetchKey + allUserCardTypes.length}
            onSelect={handleSelectItem}
            onPinFeature={handlePinFeature}
            onPinUnfeature={handlePinUnfeature}
            onRefresh={handleResetSelection}
            onScroll={offset => handleScroll(tabViewKeys.grid, offset)}
            onLayout={(layout) => handleLayout(tabViewKeys.grid, layout)}
            onSetScrollViewRef={ref => (scrollViewGridRef.current = ref)}
          />
        );
      case tabViewKeys.list:
        return (
          <ListViewContainer
            style={[
              {marginTop: tabBarHeight},
              selectedCards.length > 0 ? styles.tabContentContainer : {},
            ]}
            contentContainerStyle={{
              paddingTop: subTabBarHeight + otherUserHeight,
            }}
            profileId={initialProfileId}
            sortOption={sortOption}
            filterOption={filterOption}
            sortLabel={sortLabel}
            categoryLabel={!isCurrentUser ? currentUserCardType?.label : null}
            selectMode={selectMode}
            selectedCards={selectedCards}
            refetchKey={refetchKey + allUserCardTypes.length}
            onSelect={handleSelectItem}
            onRefresh={handleResetSelection}
            onScroll={offset => handleScroll(tabViewKeys.list, offset)}
            onLayout={(layout) => handleLayout(tabViewKeys.list, layout)}
            onSetScrollViewRef={ref => (scrollViewListRef.current = ref)}
          />
        );
      case tabViewKeys.collapse:
        return (
          <CollapseViewContainer
            style={[
              {marginTop: tabBarHeight},
              selectedCards.length > 0 ? styles.tabContentContainer : {},
            ]}
            contentContainerStyle={{
              paddingTop: subTabBarHeight + otherUserHeight,
            }}
            profileId={initialProfileId}
            filterOption={filterOption}
            refetchKey={refetchKey + allUserCardTypes.length}
            onSelect={handleSelectItem}
            onRefresh={handleResetSelection}
            onScroll={offset => handleScroll(tabViewKeys.collapse, offset)}
            onLayout={(layout) => handleLayout(tabViewKeys.collapse, layout)}
            onSetScrollViewRef={ref => (scrollViewCollapseRef.current = ref)}
          />
        );
      default:
        return null;
    }
  };

  const renderEmptyCollection = () => {
    if (isCurrentUser) {
      return (
        <View style={styles.container}>
          <CollectionGuide
            title={'Scan your cards to build \nyour collection'}
            description="CollX keeps track of your collection’s total value."
            onStartScan={handleStartScan}
            onAddManualCard={handleAdd}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CollectionGuide
          disabledActions
          title={`${profileData.name || 'User'} hasn’t added \nany cards yet.`}
          description={`${profileData.name || 'User'} recently added cards will \nshow up here.`}
        />
      </View>
    );
  };

  const renderMainCollection = () => {
    const isEmptyCollection = currentSportCount === 0 && !searchInModeRef.current && !Object.keys(currentFilter || {}).length && currentUserCardType.value === 0;

    // if (currentSportCount === -1 && !searchInModeRef.current) {
    //   return <LoadingIndicator isLoading />;
    // }

    if (isEmptyCollection) {
      return renderEmptyCollection();
    }

    return (
      <View style={styles.container}>
        <TabView
          lazy
          keyboardDismissMode="none"
          navigationState={{index: tabBarIndex, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleChangeTabBarIndex}
        />
        {renderOtherUser()}
        {renderScrollToTop()}
      </View>
    );
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <LoadingIndicator isLoading={isUpdating} />
        <Suspense fallback={<View style={styles.subTitleContainer} />}>
          {isLoggedIn ? (
            <CollectionSummaryContainer
              profileId={initialProfileId}
              userCardType={currentUserCardType}
              filterOption={filterOption}
              refetchKey={refetchKey}
              onChangeUserCardCount={handleChangeUserCardCount}
            />
          ) : null}
        </Suspense>
        <Suspense fallback={<View />}>
          <CollectionSportList
            profile={profileData}
            userCardType={currentUserCardType}
            isOpen={isOpenCardTypeList}
            refetchKey={refetchKey}
            onChangeType={handleSelectCardType}
            onChangeAllCardTypes={handleChangeAllCardTypes}
          />
        </Suspense>
        {renderMainCollection()}
        <BottomView
          ref={actionBottomSheetRef}
          isCurrentUser={isCurrentUser}
          isProUser={isProUser}
          cardsCount={selectedCards.length}
          onRemove={handleRemoveCards}
          onAddToDeal={handleAddCardsToDeal}
          onPinFeatureCards={handlePinFeatureCards}
          onPinUnfeatureCards={handlePinUnfeatureCards}
        />
      </View>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  shortTitleContainer: {
    maxWidth: wp(40),
  },
  navBarRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  navBarButton: {
    flex: 0,
    minWidth: 70,
    paddingHorizontal: 8,
  },
  navBarAddButton: {
    paddingHorizontal: 8,
  },
  navBarIconButton: {
    flex: 0,
    width: 28,
    height: 28,
    marginRight: 10,
  },
  subTitleContainer: {
    height: subTitleHeight,
  },
  userInfoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: otherUserMarginTop,
  },
  tabBarMainContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    elevation: 1,
  },
  tabBarWrapper: {
    zIndex: 1,
    elevation: 1,
    overflow: 'hidden',
  },
  tabBarContainer: {
    backgroundColor: colors.primaryBackground,
  },
  tabBarSubContainer: {
    position: 'absolute',
    left: 6,
    right: 6,
    backgroundColor: colors.primaryBackground,
  },
  tabBarIndicatorContainer: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryBorder,
  },
  tabBarIndicator: {
    height: 3,
    alignSelf: 'center',
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginVertical: -3,
  },
  iconTabBar: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  tabContentContainer: {
    paddingBottom: Styles.collectionActionBarHeight,
  },
}));

export default withCollection(CollectionContent);
