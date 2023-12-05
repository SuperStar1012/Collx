import React, {Suspense, useState, useCallback, useEffect} from 'react';
import {FlatList, View, Text, SafeAreaView} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  NavBarButton,
  NavBarModalHeader,
  Button,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SellerToolsItem from './components/SellerToolsItem';

import {createUseStyle, Fonts} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';

const closeIcon = require('assets/icons/close.png');

const settingsData = [
  {
    label: 'My Shipping Address',
    icon: require('assets/icons/shipping_box.png'),
    route: 'ShippingAddressModal',
    params: {},
  },
  {
    label: 'Seller Tools',
    icon: require('assets/icons/tag_outline.png'),
    route: 'SellerTools',
    params: {
      isHideTaxpayer: true,
    },
  },
];

const SetSellerSettingsPage = (props) => {
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
  queryOptions,
}) => {
  const styles = useStyle();

  const viewerData = useLazyLoadQuery(graphql`
    query SetSellerSettingsPageQuery {
      viewer {
        addresses {
          id
          name
        }
        sellerSettings {
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

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSelect = item => {
    if (item.route) {
      navigation.navigate(item.route, item.params);
    }
  };

  const handleStartSelling = () => {
    navigation.navigate('CollectionBottomTab');
  };

  const renderItem = ({item}) => (
    <SellerToolsItem
      {...item}
      onPress={() => handleSelect(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={settingsData}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.textDescription}>
        Once you went through all the settings above, you can start selling your cards. You can manage them later in <Text style={styles.textSettings}>Settings</Text>.
      </Text>
      <Button
        style={styles.startSellingButton}
        scale={Button.scaleSize.One}
        label="Start Selling"
        labelStyle={styles.textStartSelling}
        onPress={handleStartSelling}
      />
    </SafeAreaView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  textSettings: {
    fontStyle: 'italic'
  },
  startSellingButton: {
    height: 48,
    borderRadius: 10,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: colors.primary,
  },
  textStartSelling: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.white,
    textTransform: 'capitalize',
  },
}));

export default SetSellerSettingsPage;
