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

import {Colors, createUseStyle, Fonts, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';

const RedeemAmountPage = (props) => {
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
  route
}) => {
  const {initialPrice, onDidChange} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query RedeemAmountPageQuery {
      viewer {
        myMoney {
          settled {
            balance {
              amount
              formattedAmount
            }
          }
        }
        sellerSettings {
          id
          sellerType
          ssn
          tin
          address {
            id
            address1
            address2
            careOf
            city
            country
            name
            postalCode
            state
          }
        }
      }
    }`,
    {},
    {},
  );

  if (!viewerData) {
    return null;
  }

  let availablePrice = viewerData.viewer.myMoney?.settled?.balance?.amount || 0;

  const [currentPrice, setCurrentPrice] = useState(initialPrice || 0);

  const limitError = Number(currentPrice) > Number(availablePrice);
  const tax = viewerData.viewer.sellerSettings?.ssn || viewerData.viewer.sellerSettings?.tin;
  const address = viewerData.viewer.sellerSettings?.address;
  if(address)
    address = address.id || address.address1 || address.city || address.state || address.postalCode;
  const taxError = !(tax && address);
  const isError = limitError && taxError;
  const errorTextStyle = isError ? styles.textError : {};

  const borderColor = useMemo(() => {
    let color = colors.secondaryCardBackground;

    if (isError) {
      color = Colors.red
    } else if (currentPrice) {
      color = colors.primary;
    }

    return color;
  }, [currentPrice]);

  useEffect(() => {
    setNavigationBar();
  }, [currentPrice, availablePrice]);

  const setNavigationBar = () => {
    navigation.setOptions({
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
          disabled={!currentPrice || !isNumeric(currentPrice) || Number(currentPrice) <= 0 || Number(currentPrice) > Number(availablePrice)}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    if (onDidChange) {
      onDidChange(currentPrice);
    }

    navigation.goBack();
  };

  const handleChangePrice = value => {
    setCurrentPrice(value);
  };

  const handleAddTaxInfo = () => {
    actions.navigateTaxpayerInformation();
  }

  const renderErrorState = () => {
    if(!isError)
      return null;

    if(Number(availablePrice) > 0) {
      return (
        <>
          <Text style={[styles.textDescription, errorTextStyle]}>
            Max withdraw amount: {viewerData.viewer.myMoney?.settled?.balance?.formattedAmount}
          </Text>
        </>
      )
    }
    else {
      return (
        <>
          <Text style={[styles.textDescription, errorTextStyle]}>
            Taxpayer info required.
          </Text>
        </>
      )
    }
  }

  const renderErrorMessage = () => {
    if(!isError)
      return null;

    return (
      <View style={styles.errorContentContainer}>
        <Text style={styles.errorTextDescription}>
          Federal regulations require CollX to provide a {'\n'}1099-K tax form <Text style={styles.textBold}>once gross sales exceed $600</Text>.
        </Text>
        <Text 
          style={styles.textButton}
          onPress={handleAddTaxInfo}
        >
          Add Taxpayer Information
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <TextInputUnit
          style={[styles.textInputContainer, {borderColor}]}
          textInputStyle={[styles.textInputPrice, errorTextStyle]}
          unitStyle={[styles.textInputPricePrefix, errorTextStyle]}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor={colors.placeholderText}
          unitPrefix="$"
          value={currentPrice}
          onChangeText={handleChangePrice}
        />
        {renderErrorState()}
      </View>
      {renderErrorMessage()}
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
    flex: 1,
    paddingHorizontal: 16,
  },
  errorContentContainer: {
    margin: 16,
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
    fontSize: 17,
    letterSpacing: -0.41,
    color: colors.primaryText,
    textAlign: 'left',
  },
  textInputPricePrefix: {
    fontSize: 20,
    letterSpacing: 0.38,
    fontWeight: Fonts.bold,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginTop: 12,
  },
  errorTextDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
  textButton: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
    fontWeight: Fonts.bold,
    textAlign: 'center',
    margin: 6,
  },
  textBold: {
    fontWeight: Fonts.bold,
  },
  textError: {
    color: Colors.red,
  },
}));

export default RedeemAmountPage;
