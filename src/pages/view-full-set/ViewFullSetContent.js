import React, {Suspense, useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Image,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import ActionSheet from 'react-native-actionsheet';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import SetGridViewContainer from './components/SetGridViewContainer';
import SetListViewContainer from './components/SetListViewContainer';
import SetPercent from './components/SetPercent';
import BottomView from './components/BottomView';

import {createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'
import {withExportCollection} from 'store/containers';
import {Constants} from 'globals';
import {usePrevious} from 'hooks';
import {decodeId, showErrorAlert} from 'utils';
import {analyticsNavigationRoute} from 'services';

const viewGridIcon = require('assets/icons/grid.png');
const viewListIcon = require('assets/icons/list.png');

const setTabs = {
  grid: 'grid',
  list: 'list',
};

const actionLabels = [
  'Request Printable Checklist',
  'Cancel',
];

const ViewFullSetContent = (props) => {
  const styles = useStyle();
  const {navigation} = props;

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
    ...createActions({
      navigation,
    }),
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              queryOptions={refreshedQueryOptions ?? {}}
              {...props}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({
  profileId,
  setId,
  set,
  queryOptions,
  isSettingPrintChecklist,
  isDidPrintChecklist,
  setPrintChecklist,
}) => {

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const profileData = useLazyLoadQuery(graphql`
    query ViewFullSetContentQuery {
      viewer {
        profile {
          type
        }
      }
    }`,
    {},
    queryOptions
  );

  const userType = profileData?.viewer?.profile?.type;

  const prevProps = usePrevious({userType, isDidPrintChecklist});

  const [tabBarIndex, setTabBarIndex] = useState(0);
  const [routes] = useState([
    {key: setTabs.grid, icon: viewGridIcon},
    {key: setTabs.list, icon: viewListIcon},
  ]);

  const actionBottomSheetRef = useRef(null);
  const actionSheetRef = useRef(null);
  const isAskedSetCollection = useRef(false);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (
      prevProps.userType !== Constants.userType.pro &&
      userType === Constants.userType.pro &&
      isAskedSetCollection.current
    ) {
      isAskedSetCollection.current = false;
      setExportSetCollection();
    } else if (!prevProps.isDidPrintChecklist && isDidPrintChecklist) {
      showErrorAlert(
        'Request Received',
        'The checklist will be sent to your email within a few minutes'
      );
    }
  }, [userType, isDidPrintChecklist]);

  const setExportSetCollection = () => {
    const [, numberSetId] = decodeId(setId);
    setPrintChecklist({
      setId: parseInt(numberSetId),
      type: Constants.exportCollectionType.setChecklist,
    });
  };

  const handleSelectCanonicalCard = canonicalCard => {
    actions.pushCanonicalCardDetail(canonicalCard.id);
  };

  const handleSelectTradingCard = tradingCard => {
    actions.pushTradingCardDetail(tradingCard.id);
  };

  const handleExportChecklist = (isPro) => {
    if (isPro) {
      setTimeout(() => {
        actionSheetRef.current?.show();
      });
    } else {
      isAskedSetCollection.current = true;
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.SetChecklist,
      });
    }
  };

  const handleRefresh = () => {
  };

  const handleSelectAction = async index => {
    switch (index) {
      case 0: {
        // Request Printable Checklist
        setExportSetCollection();
        break;
      }
    }
  };

  const handleChangeTabBarIndex = index => {
    setTabBarIndex(index);
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
      <SetPercent
        title={set.name}
        count={set?.viewer?.numberOfCards}
        total={set?.numberOfCards}
      />
    </>
  );

  const renderScene = ({route}) => {
    switch (route.key) {
      case setTabs.grid:
        return (
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <SetGridViewContainer
              profileId={profileId}
              setId={setId}
              onSelectCanonicalCard={handleSelectCanonicalCard}
              onSelectTradingCard={handleSelectTradingCard}
              onRefresh={handleRefresh}
            />
          </Suspense>
        );
      case setTabs.list:
        return (
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <SetListViewContainer
              profileId={profileId}
              setId={setId}
              onSelectCanonicalCard={handleSelectCanonicalCard}
              onSelectTradingCard={handleSelectTradingCard}
              onRefresh={handleRefresh}
            />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isSettingPrintChecklist} />
      <TabView
        keyboardDismissMode="none"
        navigationState={{index: tabBarIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleChangeTabBarIndex}
      />
      <Suspense fallback={<View />}>
        <BottomView
          ref={actionBottomSheetRef}
          profileId={profileId}
          onExportChecklist={handleExportChecklist}
        />
      </Suspense>
      <ActionSheet
        ref={actionSheetRef}
        title="Sent to your email within minutes"
        tintColor={colors.primary}
        options={actionLabels}
        cancelButtonIndex={actionLabels.length - 1}
        onPress={handleSelectAction}
      />
    </View>
  );
};

export default withExportCollection(ViewFullSetContent);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  tabBarContainer: {
    backgroundColor: colors.primaryBackground,
  },
  tabBarIndicatorContainer: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryBorder,
  },
  tabBarIndicator: {
    height: 3,
    alignSelf: 'center',
    marginVertical: -3,
    // width: wp(18),
    // marginHorizontal: wp(7.66),
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  iconTabBar: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
}));
