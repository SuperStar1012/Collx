import React, {Suspense, useMemo, useState, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SellerToolsItem from './components/SellerToolsItem';

import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';

const initialSettings = [
  {
    label: 'Accept Offers',
    route: 'AcceptOffers',
    value: 'Off',
  },
  {
    label: 'Seller Discount',
    route: 'SellerDiscount',
  },
  {
    label: 'Seller Minimum',
    route: 'SellerMinimum',
  },
  {
    label: 'Shipping Settings',
    route: 'ShippingSettings',
  },
  {
    label: 'Taxpayer Information',
    route: 'TaxpayerInformation',
  },
];

const SellerToolsPage = (props) => {
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
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = ({
  navigation,
  route,
  queryOptions,
}) => {
  const {isHideTaxpayer} = route.params || {};

  const styles = useStyle();

  const viewerData = useLazyLoadQuery(graphql`
    query SellerToolsPageQuery {
      viewer {
        sellerSettings {
          id
          acceptOffer
          discount
          shippingInfo
          shippingLabelGeneratedBy
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const sellerSettings = viewerData?.viewer?.sellerSettings || {};

  const settingsData = useMemo(() => {
    const listData = [...initialSettings];
    listData[0].value = sellerSettings?.acceptOffer ? 'On' : 'Off';

    if (isHideTaxpayer) {
      listData.splice(listData.length - 1, 1);
    }

    return listData;
  }, [sellerSettings, isHideTaxpayer]);

  const handleSelect = item => {
    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  const renderItem = ({item}) => (
    <SellerToolsItem
      {...item}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={settingsData}
      scrollEnabled={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default SellerToolsPage;
