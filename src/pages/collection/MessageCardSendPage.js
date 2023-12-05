import React, {useEffect, useRef, useState, useCallback, useMemo, Suspense} from 'react';
import {
  View,
  Image,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'

import {
  NavBarButton,
  NavBarModalHeader,
  LoadingIndicator,
  SearchBar,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import GridViewContainer from './components/GridViewContainer';
import ListViewContainer from './components/ListViewContainer';
import CollapseViewContainer from './components/CollapseViewContainer';

import {Constants, SchemaTypes} from 'globals';
import {withMessage} from 'store/containers';
import {createUseStyle, useTheme} from 'theme';
import {decodeId, getCardGradeAndCondition} from 'utils';

const viewGridIcon = require('assets/icons/grid.png');
const viewListIcon = require('assets/icons/list.png');
const viewSetIcon = require('assets/icons/set.png');
const closeIcon = require('assets/icons/close.png');

const tabViewKeys = {
  grid: 'grid',
  list: 'list',
  collapse: 'collapse',
};

const MessageCardSendPage= (props) => {

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
        fallback={({retry}) => <ErrorView style={styles.container} onTryAgain={retry} />}>
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

const Content = ({
  navigation,
  route,
  user,
}) => {
  const {
    channel,
    parentId,
    showInChannel,
  } = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: tabViewKeys.grid, icon: viewGridIcon},
    {key: tabViewKeys.list, icon: viewListIcon},
    {key: tabViewKeys.collapse, icon: viewSetIcon},
  ]);

  const [searchText, setSearchText] = useState(null);
  const searchInModeRef = useRef(false);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
  };

  const isLoggedIn = useMemo(() => (
    Object.keys(user).length > 0
  ), [user]);

  const filterOption = useMemo(() => {
    const options = {
      states: [
        SchemaTypes.tradingCardState.LISTED,
        SchemaTypes.tradingCardState.ACCEPTING_OFFERS,
        SchemaTypes.tradingCardState.NOT_FOR_SALE,
        SchemaTypes.tradingCardState.UNIDENTIFIED,
      ],
    };

    const searchValue = !searchInModeRef.current || (!searchText || searchText.startsWith(' ')) ? null : searchText;

    if (searchValue) {
      options.keywords = searchValue;
    }

    return options;
  }, [searchText]);

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      title: 'Send Card',
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={() => handleClose()}
        />
      ),
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSelectItem = item => {
    handleClose();

    if (!item || !item.id || !item.owner?.id) {
      return;
    }

    const conditionValues = getCardGradeAndCondition(item.condition);

    const [, tradingCardId] = decodeId(item.id);
    const [, ownerId] = decodeId(item.owner?.id);

    let cardId = null;

    if (item.card?.id) {
      // if user cards is not Unidentified card
      const [, cardDecodedId] = decodeId(item.card?.id);
      cardId = cardDecodedId;
    }

    let grade = null;
    let condition = null;

    if (conditionValues.grade || !conditionValues.condition) {
      grade = conditionValues.grade;
    } else {
      condition = conditionValues.condition;
    }

    const tradingCard = {
      id: tradingCardId,
      userId: ownerId,
      cardId,
      frontImageUrl: item.frontImageUrl,
      set: item.card?.set?.name,
      number: item.card?.number,
      player: item.card?.player?.name,
      name: item.card?.name,
      grade,
      condition,
    };

    const newMessage = {
      text: `${user.name} posted a card into the chat`,
      attachments: [
        {
          type: Constants.streamMessageType.card,
          user: {
            id: user.id,
            name: user.name,
            avatarUri: user.avatarImageUrl,
          },
          card: tradingCard,
        },
      ],
    };

    if (parentId) {
      newMessage.parent_id = parentId;
    }

    if (showInChannel) {
      newMessage.show_in_channel = showInChannel;
    }

    channel?.sendMessage(newMessage);
  };

  const handleChangeSearch = value => {
    setSearchText(value);
  };

  const handleDelete = () => {
    setSearchText('');
  };

  const handleCancel = () => {
    searchInModeRef.current = false;
    setSearchText('');
  };

  const handleFocus = () => {
    searchInModeRef.current = true;
  };

  const handleBlur = () => {
    searchInModeRef.current = false;
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <SearchBar
          style={styles.searchBar}
          placeholder="Search Items"
          onChangeText={handleChangeSearch}
          onDelete={handleDelete}
          onCancel={handleCancel}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    );
  };

  const renderScene = ({route}) => {
    const sortOption = [SchemaTypes.tradingCardOrder.NEWEST_FIRST];

    switch (route.key) {
      case tabViewKeys.grid:
        return (
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <GridViewContainer
              isLoggedIn={isLoggedIn}
              filterOption={filterOption}
              sortOption={sortOption}
              onSelect={handleSelectItem}
            />
          </Suspense>
        );
      case tabViewKeys.list:
        return (
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <ListViewContainer
              isLoggedIn={isLoggedIn}
              filterOption={filterOption}
              sortOption={sortOption}
              onSelect={handleSelectItem}
            />
          </Suspense>
        );
      case tabViewKeys.collapse:
        return (
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <CollapseViewContainer
              isLoggedIn={isLoggedIn}
              filterOption={filterOption}
              sortOption={sortOption}
              isVisibleViewAll={false}
              onSelect={handleSelectItem}
            />
          </Suspense>
        );
      default:
        return null;
    }
  };

  const renderTabBarIcon = ({route, color}) => (
    <Image
      source={route.icon}
      style={[styles.iconTabBar, {tintColor: color}]}
    />
  );

  const renderTabBar = tabBarProps => (
    <>
      <TabBar
        {...tabBarProps}
        style={styles.tabBarContainer}
        activeColor={colors.primary}
        inactiveColor={colors.lightGrayText}
        indicatorContainerStyle={styles.tabBarIndicatorContainer}
        indicatorStyle={styles.tabBarIndicator}
        renderIcon={renderTabBarIcon}
      />
      {renderSearchBar()}
    </>
  );

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <TabView
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
        />
      </View>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryHeaderBackground,
  },
  iconClose: {},
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 8,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 9,
  },
  tabBarContainer: {
    backgroundColor: 'transparent',
  },
  tabBarIndicatorContainer: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryBorder,
  },
  tabBarIndicator: {
    height: 3,
    alignSelf: 'center',
    // width: wp(18),
    // marginHorizontal: wp(7.66),
    marginVertical: -3,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  iconTabBar: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
}));

export default withMessage(MessageCardSendPage);
