/* eslint-disable no-undef */
import React, {Suspense, useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {View, FlatList} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';
import {useApplePay, useGooglePay} from '@stripe/stripe-react-native';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SelectPaymentMethodItem from './components/SelectPaymentMethodItem';
import AddPaymentCardItem from './components/AddPaymentCardItem';

import {createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {withPaymentMethods} from 'store/containers';
import {Constants} from 'globals';
import createActions from './actions';

const defaultActionLabels = ['Remove Card', 'Cancel'];
const normalActionLabels = ['Set as Default', 'Remove Card', 'Cancel'];

const SelectPaymentMethodPage = (props) => {
  const {
    navigation,
  } = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
    handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}
        >
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <MainContent
              {...props}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const MainContent = (props) => {
  const {
    queryOptions,
  } = props;

  const viewerData = useLazyLoadQuery(graphql`
    query SelectPaymentMethodPageQuery {
      viewer {
        buyerSettings {
          stripeCustomerId
          stripeDefaultPaymentMethodId          
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  return (
    <Content
      {...props}
      buyerSettings={viewerData.viewer?.buyerSettings}
    />
  );
};

const Content = (props) => {
  const {
    navigation,
    route,
    buyerSettings,
    isFetching,
    isDetachingPaymentMethod,
    paymentMethods,
    getPaymentMethods,
    detachPaymentMethod,
    updateCustomer,
  } = props;

  const {onSelectPayment} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const {isApplePaySupported} = useApplePay();
  const {isGooglePaySupported} = useGooglePay();

  const actionSheetRef = useRef(null);
  const currentPayment = useRef(null);

  const [isGooglePaySupport, setIsGooglePaySupport] = useState(false);
  const [currentActionLabels, setCurrentActionLabels] = useState([]);

  const customerId = buyerSettings?.stripeCustomerId;
  const defaultPaymentMethodId = buyerSettings?.stripeDefaultPaymentMethodId;

  useEffect(() => {
    getCustomersAndPaymentMethods();

    (async () => {
      const isGooglePaySupport = await isGooglePaySupported({
        testEnv: __DEV__,
      });

      setIsGooglePaySupport(isGooglePaySupport);
    })();
  }, []);

  useEffect(() => {
    // Set default payment automatically
    if (!paymentMethods.length) {
      return;
    }

    if (!defaultPaymentMethodId || defaultPaymentMethodId === currentPayment.current?.id) {
      handleSetDefaultPaymentMethod(paymentMethods[0]);
      return;
    }

    const paymentMethod = paymentMethods.find(item => item.id === defaultPaymentMethodId);
    if (!paymentMethod) {
      handleSetDefaultPaymentMethod(paymentMethods[0]);
    }
  }, [defaultPaymentMethodId, paymentMethods]);

  const currentPaymentMethods = useMemo(() => {
    const morePaymentMethods = [...paymentMethods];

    if (isApplePaySupported) {
      morePaymentMethods.push(Constants.extraPaymentMethods.apple);
    }

    if (isGooglePaySupport) {
      morePaymentMethods.push(Constants.extraPaymentMethods.google);
    }

    return morePaymentMethods;
  }, [paymentMethods, isApplePaySupported, isGooglePaySupport]);

  const getCustomersAndPaymentMethods = () => {
    if (customerId) {
      getPaymentMethods(customerId);
    }
  };

  const handleRefresh = () => {
    actions.handleRefresh();

    getCustomersAndPaymentMethods();
  };

  const handleChangePaymentMethod = payment => {
    if (onSelectPayment) {
      onSelectPayment(payment);
      navigation.goBack();
      return;
    }
  };

  const handleAddPaymentMethod = () => {
    actions.navigateAddPaymentCard();
  };

  const handleActionMore = (payment) => {
    currentPayment.current = payment;

    setCurrentActionLabels(currentPayment.current?.id === defaultPaymentMethodId ? defaultActionLabels : normalActionLabels);

    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleSetDefaultPaymentMethod = paymentMethod => {
    if (!customerId || !paymentMethod?.id) {
      return;
    }

    updateCustomer({
      customerId,
      params: {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      },
    });
  };

  const handleSelectAction = async index => {
    switch (currentActionLabels[index]) {
      case 'Set as Default': {
        // Set as Default
        handleSetDefaultPaymentMethod(currentPayment.current);
        currentPayment.current = null;
        break;
      }
      case 'Remove Card': {
        // Remove Card
        if (currentPayment.current) {
          detachPaymentMethod(currentPayment.current.id);
        }
        break;
      }
    }
  };

  const renderItem = ({item}) => (
    <SelectPaymentMethodItem
      payment={item}
      disabled={!onSelectPayment}
      onSelect={handleChangePaymentMethod}
      onEdit={handleActionMore}
    />
  );

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <View style={styles.container}>
          <LoadingIndicator isLoading={isFetching || isDetachingPaymentMethod} />
          <FlatList
            style={styles.sectionContainer}
            data={currentPaymentMethods}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshing={false}
            onRefresh={handleRefresh}
          />
          <AddPaymentCardItem
            tabBarHeight={tabBarHeight}
            onPress={handleAddPaymentMethod}
          />
          <ActionSheet
            ref={actionSheetRef}
            tintColor={colors.primaryText}
            options={currentActionLabels}
            destructiveButtonIndex={currentActionLabels.length - 2}
            cancelButtonIndex={currentActionLabels.length - 1}
            onPress={handleSelectAction}
          />
        </View>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  sectionContainer: {
    flexGrow: 0,
  },
}));

export default withPaymentMethods(SelectPaymentMethodPage);
