import React, {Suspense, useState} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {TabView, TabBar} from 'react-native-tab-view';

import {
  LoadingIndicator,
} from 'components';
import MyCheckoutList from './components/MyCheckoutList';

import {SchemaTypes} from 'globals';
import {Fonts, createUseStyle, useTheme} from 'theme';

const tabViewKeys = {
  all: 'All',
  orderPlaced: 'Order Placed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

const CheckoutContent = (props) => {
  const {ordersWithUserAs, queryOptions} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: tabViewKeys.all, title: tabViewKeys.all},
    {key: tabViewKeys.orderPlaced, title: tabViewKeys.orderPlaced},
    {key: tabViewKeys.shipped, title: tabViewKeys.shipped},
    {key: tabViewKeys.delivered, title: tabViewKeys.delivered},
    {key: tabViewKeys.completed, title: tabViewKeys.completed},
    {key: tabViewKeys.cancelled, title: tabViewKeys.cancelled},
    {key: tabViewKeys.disputed, title: tabViewKeys.disputed},
  ]);

  const renderTabScene = (orderStateGroup, isActivated) => {
    if (!isActivated) {
      return null;
    }

    return (
      <Suspense fallback={<LoadingIndicator isLoading />}>
        <MyCheckoutListContainer
          queryOptions={queryOptions}
          orderStateGroup={orderStateGroup}
          ordersWithUserAs={ordersWithUserAs}
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
      case tabViewKeys.orderPlaced:
        return renderTabScene(
          SchemaTypes.orderStateGroup.ORDER_PLACED,
          routes[index].key === route.key
        );
      case tabViewKeys.shipped:
        return renderTabScene(
          SchemaTypes.orderStateGroup.SHIPPED,
          routes[index].key === route.key
        );
      case tabViewKeys.delivered:
        return renderTabScene(
          SchemaTypes.orderStateGroup.DELIVERED,
          routes[index].key === route.key
        );
      case tabViewKeys.completed:
        return renderTabScene(
          SchemaTypes.orderStateGroup.COMPLETED,
          routes[index].key === route.key
        );
      case tabViewKeys.cancelled:
        return renderTabScene(
          SchemaTypes.orderStateGroup.CANCELLED,
          routes[index].key === route.key
        );
      case tabViewKeys.disputed:
        return renderTabScene(
          SchemaTypes.orderStateGroup.DISPUTED,
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

const MyCheckoutListContainer = ({
  queryOptions,
  ordersWithUserAs,
  orderStateGroup,
}) => {
  const queryData = useLazyLoadQuery(
    graphql`
      query CheckoutContentContainerQuery($ordersCondition: OrdersWith) {
        viewer {
          ...MyCheckoutListQuery_viewer @arguments(ordersCondition: $ordersCondition)
        }
      }
    `,
    {
      ordersCondition: {
        meAs: ordersWithUserAs,
        stateGroup: orderStateGroup,
      },
    },
    queryOptions
  );

  if (!queryData) {
    return null;
  }

  return (
    <MyCheckoutList
      ordersWithUserAs={ordersWithUserAs}
      orderStateGroup={orderStateGroup}
      viewer={queryData.viewer}
    />
  );
};

export default CheckoutContent;

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
