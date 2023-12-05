import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import isNumeric from 'validator/lib/isNumeric';

import {
  LoadingIndicator,
  KeyboardAvoidingScrollView,
  Switch,
  NavBarButton,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SegmentedControl from './components/SegmentedControl';

import {Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {showErrorAlert} from 'utils';

const exclamationIcon = require('assets/icons/exclamation_circle.png')

const percentageData = [
  {label: '5%', value: 5},
  {label: '10%', value: 10},
  {label: '15%', value: 15},
  {label: '20%', value: 20},
  {label: '25%', value: 25},
  {label: '30%', value: 30},
];

const minimumPriceData = [
  {label: '$25', value: 25},
  {label: '$50', value: 50},
  {label: '$100', value: 100},
  {label: '$250', value: 250},
  {label: '$350', value: 350},
  {label: '$500', value: 500},
];

const SellerDiscountPage = (props) => {
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

const Content = (props) => {
  const {navigation, queryOptions} = props;

  const styles = useStyle();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query SellerDiscountPageQuery {
      viewer {
        sellerSettings {
          id
          discount
          threshold
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

  const [isDealDiscount, setIsDealDiscount] = useState(!!(sellerSettings?.discount || sellerSettings?.threshold));
  const [discountPercentage, setDiscountPercentage] = useState(sellerSettings?.discount || '');
  const [minimumPrice, setMinimumPrice] = useState((sellerSettings?.threshold || 0) / 100);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNavigationBar();
  }, [isDealDiscount, discountPercentage, minimumPrice]);

  const setNavigationBar = () => {
    const isDisabled = isDealDiscount && (
      !isNumeric(minimumPrice.toString()) ||
      !isNumeric(discountPercentage.toString()) ||
      minimumPrice <= 0 ||
      discountPercentage > 100 ||
      discountPercentage <= 0
    );

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
          disabled={isDisabled}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    setIsSaving(true);

    actions.setSellerDiscount(
      Number(discountPercentage) || 0,
      (Number(minimumPrice) || 0) * 100,
      {
        onComplete: () => {
          setIsSaving(false);
          handleCancel();
        },
        onError: (error) => {
          console.log(error);
          setIsSaving(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  const handleChangeValue = (value) => {
    setIsDealDiscount(value);

    if (value) {
      setDiscountPercentage(sellerSettings?.discount || percentageData[3].value);
      setMinimumPrice(((sellerSettings?.threshold || 0) / 100) || minimumPriceData[2].value);
    } else {
      setDiscountPercentage('');
      setMinimumPrice('');
    }
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator isLoading={isSaving} />
      <Switch
        style={styles.switchContainer}
        label="Deal Discount"
        value={isDealDiscount}
        onChangedValue={handleChangeValue}
      />
      <Text style={styles.textDescription}>
        Note that Seller Discount will only be displayed if all items in Deal have a For Sale price listed.
      </Text>
      <Text style={styles.textSectionTitle}>
        Discount Percentage
      </Text>
      <SegmentedControl
        data={percentageData}
        value={discountPercentage}
        disabled={!isDealDiscount}
        customPostfix="%"
        onChangeValue={setDiscountPercentage}
      />
      <Text style={styles.textSectionTitle}>
        Minimum Total Value
      </Text>
      <SegmentedControl
        data={minimumPriceData}
        value={minimumPrice}
        disabled={!isDealDiscount}
        customPrefix="$"
        onChangeValue={setMinimumPrice}
      />
      {isDealDiscount ? (
        <>
          <Text style={styles.textSectionTitle}>
            Preview
          </Text>
          <View style={styles.reviewContainer}>
            <View style={styles.reviewContentContainer}>
              <Image style={styles.iconInfo} source={exclamationIcon} />
              <Text style={styles.textReview}>
                {`${discountPercentage || 0}% off on orders of $${minimumPrice || 0} more`}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </KeyboardAvoidingScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  switchContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginHorizontal: 16,
    marginTop: 14,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  reviewContainer: {
    padding: 16,
    backgroundColor: colors.primaryCardBackground,
  },
  reviewContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.secondaryBackground,
  },
  iconInfo: {
    width: 23,
    height: 23,
    tintColor: colors.primary,
  },
  textReview: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
    marginHorizontal: 2,
  },
}));

export default SellerDiscountPage;
