/* eslint-disable no-undef */
import React, {useEffect, useState, useCallback, Suspense, useMemo} from 'react';
import {View} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  AllowPushNotificationSheet,
} from 'components';
import NavBarLeft from './components/NavBarLeft';
import NavBarTitle from './components/NavBarTitle';
import NavBarRight from './components/NavBarRight';
import HomeContent from './HomeContent';

import {Constants, Styles} from 'globals';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withHome} from 'store/containers';
import {createUseStyle, useTheme} from 'theme';
import {wp} from 'utils';

const HomePage = (props) => {
  const {
    navigation,
    pushNotificationRequestType,
    selectedCategory,
    getConfig,
    setFilter,
    getProducts,
    getReleaseNote,
    getPosts,
  } = props;

  Styles.headerNavBarHeight = useHeaderHeight() || 0;
  Styles.bottomTabBarHeight = useBottomTabBarHeight() || 0;

  const {t: {icons}} = useTheme();
  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);
  const [isVisiblePushAccess, setIsVisiblePushAccess] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));

    getAppInfo();
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation, setFilter}),
    refresh: handleRefresh,
  };

  const currentCategoryLabel = useMemo(() => (
    selectedCategory ? selectedCategory.label : 'All'
  ), [selectedCategory]);

  useEffect(() => {
    getAppInfo();
  }, []);

  useEffect(() => {
    if (pushNotificationRequestType === Constants.notificationRequestType.askToEnable) {
      navigation.navigate('NotificationSplash');
    } else if (pushNotificationRequestType === Constants.notificationRequestType.askToReenable) {
      setIsVisiblePushAccess(true);
    }
  }, [pushNotificationRequestType]);

  useEffect(() => {
    setNavigationBar();
  }, [icons, currentCategoryLabel]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => (
        <NavBarLeft
          categoryLabel={currentCategoryLabel}
          onPress={handleSelectCategory}
        />
      ),
      headerTitleContainerStyle: styles.headerTitleContainer,
      headerTitle: () => (
        <NavBarTitle
          categoryLabel={currentCategoryLabel}
          onSearch={handleSearchCards}
        />
      ),
      headerRight: () => (
        <NavBarRight
          onSearchUsers={handleSearchUsers}
          onNotifications={handleNotifications}
        />
      ),
    });
  };

  const getAppInfo = () => {
    // Gets app config
    getConfig();

    // Gets what's new
    getReleaseNote();

    // Gets products
    getProducts();

    // Gets social networks
    getPosts();
  };

  const handleClosePushAccess = () => {
    setIsVisiblePushAccess(false);
  };

  const handleSelectCategory = () => {
    navigation.openDrawer();
  };

  const handleSearchCards = () => {
    actions.navigateSearch();
  };

  const handleSearchUsers = () => {
    actions.navigateSearchUsers();
  };

  const handleNotifications = () => {
    actions.navigateNotifications();
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView style={styles.container} onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <HomeContent
              {...props}
              selectedCategory={selectedCategory}
              queryOptions={refreshedQueryOptions}
            />
            <AllowPushNotificationSheet
              isVisible={isVisiblePushAccess}
              onClose={handleClosePushAccess}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

export default withHome(HomePage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  headerTitleContainer: {
    width: wp(48),
    paddingLeft: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
