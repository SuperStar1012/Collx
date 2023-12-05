import React, {Suspense, useState, useEffect, useCallback, useMemo} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import isNumeric from 'validator/lib/isNumeric';

import {
  NavBarButton,
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
  TextInputUnit,
} from 'components';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {getPrice, showErrorAlert} from 'utils';
import {SchemaTypes} from 'globals';

const ApplyPricePage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
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
  const {
    priceType,
    orderTotal,
    amount,
    orderId,
  } = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const [currentPrice, setCurrentPrice] = useState(amount || '');
  const [isApplyingPrice, setIsApplyingPrice] = useState(false);

  const isCreditApplied = priceType === SchemaTypes.orderChargeBreakdownItemType.CREDIT_APPLIED;

  const queryData = useLazyLoadQuery(
    graphql`
      query ApplyPricePageQuery($id: ID!) {
        order(with: {id: $id}) {
          viewer {
            balanceThatCanBeApplied {
              amount
            }
            creditThatCanBeApplied {
              amount
            }
          }
        }
      }
    `,
    {
      id: orderId
    },
    queryOptions,
  );

  const availablePrice = useMemo(() => {
    return (isCreditApplied ? queryData.order.viewer?.creditThatCanBeApplied?.amount : queryData.order.viewer?.balanceThatCanBeApplied?.amount) || 0;
  }, [currentPrice]);

  const isErrorAvailable = Number(currentPrice) > Number(availablePrice)
  const isErrorTotal = Number(currentPrice) > Number((orderTotal || 0) + (amount || 0));

  const errorTextStyle = isErrorAvailable || isErrorTotal ? styles.textError : {};

  const borderColor = useMemo(() => {
    let color = colors.secondaryCardBackground;

    if (currentPrice) {
      color = colors.primary;
    }

    if (isErrorAvailable || isErrorTotal) {
      color = Colors.red
    }

    return color;
  }, [currentPrice]);

  useEffect(() => {
    setNavigationBar();
  }, [currentPrice, availablePrice]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: `Apply ${isCreditApplied ? 'CollX Credit' : 'Balance'}`,
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={handleCancel}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          disabled={!isNumeric(currentPrice) || Number(currentPrice) < 0 || isErrorAvailable || isErrorTotal}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    if (!orderId) {
      return;
    }

    setIsApplyingPrice(true);

    if (isCreditApplied) {
      actions.setCreditsToApplyToOrder(
        orderId,
        currentPrice,
        {
          onComplete: () => {
            setIsApplyingPrice(false);
            handleCancel();
          },
          onError: (error) => {
            console.log(error);
            setIsApplyingPrice(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          }
        }
      );
    } else {
      actions.setBalanceToApplyToOrder(
        orderId,
        currentPrice,
        {
          onComplete: () => {
            setIsApplyingPrice(false);
            handleCancel();
          },
          onError: (error) => {
            console.log(error);
            setIsApplyingPrice(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          }
        }
      );
    }
  };

  const handleChangePrice = value => {
    setCurrentPrice(value);
  };

  return (
    <KeyboardAvoidingScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LoadingIndicator isLoading={isApplyingPrice} />
      <TextInputUnit
        style={[styles.textInputContainer, {borderColor}]}
        textInputStyle={[styles.textInputPrice, errorTextStyle]}
        unitStyle={[styles.textInputPricePrefix, errorTextStyle]}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="numeric"
        placeholderTextColor={colors.placeholderText}
        unitPrefix="$"
        value={currentPrice}
        onChangeText={handleChangePrice}
      />
      {isErrorAvailable || isErrorTotal ? (
        <Text style={[styles.textCredit, styles.textDescription, styles.textError]}>
          {`The amount entered exceeded ${isErrorAvailable ? 'your credit balance' : 'the order total'}.`}
        </Text>
      ) : null}
      <View style={styles.availableValueContainer}>
        <Text style={styles.textCredit}>
          {`${isCreditApplied ? 'CollX Credit' : 'Balance'} available:`}
        </Text>
        <Text style={[styles.textCredit, styles.textValue]}>
          {getPrice(availablePrice || 0)}
        </Text>
      </View>
      <View style={styles.orderValueContainer}>
        <Text style={styles.textCredit}>
          Order total:
        </Text>
        <Text style={[styles.textCredit, styles.textValue]}>
          {getPrice(orderTotal || 0)}
        </Text>
      </View>
    </KeyboardAvoidingScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  textInputContainer: {
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.secondaryCardBackground,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 16,
  },
  textInputPrice: {
    fontSize: 15,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textAlign: 'left',
  },
  textInputPricePrefix: {
    fontSize: 15,
    letterSpacing: -0.24,
  },
  availableValueContainer: {
    flexDirection: 'row',
    alingItems: 'center',
    marginTop: 12,
  },
  orderValueContainer: {
    flexDirection: 'row',
    alingItems: 'center',
    marginTop: 8,
  },
  textCredit: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textValue: {
    fontWeight: Fonts.bold,
    marginLeft: 5,
  },
  textDescription: {
    marginTop: 8,
  },
  textError: {
    color: Colors.red,
  },
}));

export default ApplyPricePage;
