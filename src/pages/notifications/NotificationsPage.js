import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList} from 'react-native';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';
import {TabView, TabBar} from 'react-native-tab-view';

import {
  LoadingIndicator,
  FooterIndicator,
  Badge,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import NotificationItem from './components/NotificationItem';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {Constants, SchemaTypes} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';
import {openUrl} from 'utils';

const readMarkTimeout = 5 * 1000;

const tabViewKeys = {
  all: 'All',
  deals: 'Deals',
  orders: 'Orders',
  comments: 'Comments',
  likes: 'Likes',
  followers: 'Followers',
  credit: 'Credit',
};

const NotificationsPage = props => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}
        >
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              {...props}
              queryOptions={refreshedQueryOptions}
              onRefetch={handleRefresh}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({
  navigation,
  queryOptions,
}) => {
  const viewerData = useLazyLoadQuery(graphql`
    query NotificationsPageQuery {
      viewer {
        ...NotificationsPageQuery_viewer
        ...FollowButton_viewer
      }
    }`,
    {},
    queryOptions,
  );
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: tabViewKeys.all, title: tabViewKeys.all},
    {key: tabViewKeys.deals, title: tabViewKeys.deals},
    {key: tabViewKeys.orders, title: tabViewKeys.orders},
    {key: tabViewKeys.comments, title: tabViewKeys.comments},
    {key: tabViewKeys.likes, title: tabViewKeys.likes},
    {key: tabViewKeys.followers, title: tabViewKeys.followers},
    {key: tabViewKeys.credit, title: tabViewKeys.credit},
  ]);

  if (!viewerData) {
    return null;
  }

  const renderTabScene = (notificationType, isActivated) => {
    if (!isActivated) {
      return null;
    }
    return (
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <NotificationsList
          navigation={navigation}
          viewer={viewerData.viewer}
          notificationType={notificationType}
        />
      </Suspense>
    );
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case tabViewKeys.all:
        return renderTabScene(
          null,
          routes[index].key === route.key
        );
      case tabViewKeys.deals:
        return renderTabScene(
          SchemaTypes.notificationType.DEAL,
          routes[index].key === route.key
        );
      case tabViewKeys.orders:
        return renderTabScene(
          SchemaTypes.notificationType.ORDER,
          routes[index].key === route.key
        );
      case tabViewKeys.comments:
        return renderTabScene(
          SchemaTypes.notificationType.COMMENT,
          routes[index].key === route.key
        );
      case tabViewKeys.likes:
        return renderTabScene(
          SchemaTypes.notificationType.LIKE,
          routes[index].key === route.key
        );
      case tabViewKeys.followers:
        return renderTabScene(
          SchemaTypes.notificationType.FOLLOW,
          routes[index].key === route.key
        );
      case tabViewKeys.credit:
        return renderTabScene(
          SchemaTypes.notificationType.CREDIT,
          routes[index].key === route.key
        );
      default:
        return null;
    }
  };

  const renderTabBar = tabBarProps => (
    <TabBar
      {...tabBarProps}
      style={styles.tabBarContainer}
      tabStyle={styles.tabBatItemContainer}
      scrollEnabled
      labelStyle={styles.textTabBarItem}
      activeColor={colors.primary}
      inactiveColor={colors.lightGrayText}
      indicatorStyle={styles.tabBarIndicator}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        lazy
        keyboardDismissMode="none"
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const NotificationsList = ({
  navigation,
  viewer,
  notificationType,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const { data: queryData, loadNext, isLoadingNext, hasNext, refetch } = usePaginationFragment(
    graphql`
      fragment NotificationsPageQuery_viewer on Viewer
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 20 }
        after: { type: "String" }
        with: { type: "NotificationsWith", defaultValue: {types: [COMMENT, COMMENT_REPLY, CREDIT, DEAL, DEEPLINK, FOLLOW, INFO, LIKE, ORDER, UPDATE, WEBLINK]} }
      )
      @refetchable(queryName: "NotificationsListPaginationQuery") {
        notifications(after: $after, first: $first, with: $with)
        @connection(key: "NotificationsPageQuery_viewer__notifications") {
          unreadCount
          edges {
            node {
              id
              ...NotificationItem_notification
            }
          }
        }
      }
      `,
    viewer
  );

  if (!queryData) {
    return null;
  }

  const {unreadCount} = queryData.notifications || {};

  useEffect(() => {
    setNavigationBar();

    let timeoutId = null;

    if (unreadCount > 0) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        actions.markReadAllNotification();
      }, readMarkTimeout);
    }

    return () => {
      if (!timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [unreadCount]);

  useEffect(() => {
    if (!notificationType) {
      return;
    }
    handleRefresh();
  }, [notificationType]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerTitle: ({style}) => (
        <View style={styles.headerTitleContainer}>
          <Text style={style}>Notifications</Text>
          {unreadCount > 0 ? (
            <Badge label={unreadCount} />
          ) : null}
        </View>
      ),
      headerShadowVisible: false,
    });
  };

  const handleRefresh = () => {
    if (notificationType) {
      refetch({
        with: {types: [notificationType]},
      }, {fetchPolicy: 'network-only'});
      return;
    }
    refetch({}, {fetchPolicy: 'network-only'});
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  const handleSelect = item => {
    console.log('&&&&&&', item)
    switch (item.__typename) {
      case Constants.notificationTypeName.followNotification:
        if (item.who?.id) {
          navigation.navigate('Profile', {
            profileId: item.who?.id,
          });
        }
        return;
      case Constants.notificationTypeName.commentNotification:
      case Constants.notificationTypeName.commentReplyNotification: {
        if (item.tradingCard?.id) {
          actions.pushCardDetailWithComments(item.tradingCard?.id);
        }
        return;
      }
      case Constants.notificationTypeName.deeplinkNotification:
      case Constants.notificationTypeName.orderNotification:
      case Constants.notificationTypeName.weblinkNotification: {
        if (item.link) {
          openUrl(item.link);
        }
        return;
      }
      case Constants.notificationTypeName.likeNotification: {
        if (item.tradingCard?.id) {
          actions.pushTradingCardDetail(item.tradingCard?.id);
        }
        return;
      }
    }
  };

  const handleAvatarSelect = item => {
    if (item.who?.id) {
      actions.pushProfile(item.who.id);
    }
  };

  const handleViewCredit = () => {
    actions.navigateCreditHistory();
  };

  const renderItem = ({item}) => (
    <NotificationItem
      viewer={viewer}NotificationItem
      notification={item?.node}
      onPress={handleSelect}
      onAvatarPress={handleAvatarSelect}
      onViewCredit={handleViewCredit}
    />
  );

  const renderEmpty = () => (
    <Text style={styles.textNoResult}>No matches found</Text>
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      style={styles.container}
      data={queryData.notifications?.edges}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefresh}
      refreshing={false}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNoResult: {
    color: colors.darkGrayText,
    marginVertical: 30,
    textAlign: 'center',
  },
  tabBarContainer: {
    backgroundColor: colors.primaryBackground,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryBorder,
  },
  tabBatItemContainer: {
    width: 120,
  },
  tabBarIndicator: {
    height: 2,
    alignSelf: 'center',
    marginVertical: -2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  textTabBarItem: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
  },
}));

export default NotificationsPage;