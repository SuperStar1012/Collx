import React, {Suspense, useState} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {TabView, TabBar} from 'react-native-tab-view';

import {
  LoadingIndicator,
} from 'components';
import MyTransactionList from './components/MyTransactionList';

import {SchemaTypes} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';

const tabViewKeys = {
  all: 'All',
  pending: 'Pending',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

const TransactionContent = ({
  queryOptions,
  transactionType
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: tabViewKeys.all, title: tabViewKeys.all},
    {key: tabViewKeys.pending, title: tabViewKeys.pending},
    {key: tabViewKeys.sent, title: tabViewKeys.sent},
    {key: tabViewKeys.accepted, title: tabViewKeys.accepted},
    {key: tabViewKeys.rejected, title: tabViewKeys.rejected},
    {key: tabViewKeys.cancelled, title: tabViewKeys.cancelled},
    {key: tabViewKeys.expired, title: tabViewKeys.expired},
  ]);

  const renderTabScene = (dealStates, isActivated) => {
    if (!isActivated) {
      return null;
    }

    return (
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <MyTransactionListContainer
          queryOptions={queryOptions}
          dealStates={dealStates}
          transactionType={transactionType}
        />
      </Suspense>
    );
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case tabViewKeys.all:
        return renderTabScene(
          undefined,
          routes[index].key === route.key
        );
      case tabViewKeys.pending:
        return renderTabScene(
          [SchemaTypes.dealState.PENDING],
          routes[index].key === route.key
        );
      case tabViewKeys.sent:
        return renderTabScene(
          [SchemaTypes.dealState.OFFER_SENT],
          routes[index].key === route.key
        );
      case tabViewKeys.accepted:
        return renderTabScene(
          [
            SchemaTypes.dealState.ACCEPTED,
            SchemaTypes.dealState.COMPLETED,
          ],
          routes[index].key === route.key
        );
      case tabViewKeys.rejected:
        return renderTabScene(
          [SchemaTypes.dealState.REJECTED],
          routes[index].key === route.key
        );
      case tabViewKeys.cancelled:
        return renderTabScene([SchemaTypes.dealState.CANCELLED], routes[index].key === route.key);
      case tabViewKeys.expired:
        return renderTabScene([SchemaTypes.dealState.EXPIRED], routes[index].key === route.key);
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

const MyTransactionListContainer = ({
  queryOptions,
  transactionType,
  dealStates,
}) => {
  const queryData = useLazyLoadQuery(
    graphql`
      query TransactionContentQuery($dealCondition: DealsWith) {
        viewer {
          ...MyTransactionListQuery_viewer @arguments(dealCondition: $dealCondition)
        }
      }
    `,
    {
      dealCondition: {
        meAs: transactionType,
        states: dealStates,
      },
    },
    queryOptions
  );

  if (!queryData) {
    return null;
  }

  return (
    <MyTransactionList
      transactionType={transactionType}
      dealStates={dealStates}
      viewer={queryData.viewer}
    />
  );
};

export default TransactionContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  tabBarContainer: {
    backgroundColor: colors.primaryBackground,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryBorder,
  },
  tabBatItemContainer: {
    width: 100,
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
