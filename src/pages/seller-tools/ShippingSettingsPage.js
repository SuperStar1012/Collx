import React, {Suspense, useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {View, Alert} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  Switch,
  KeyboardAvoidingScrollView,
  NavBarButton,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import ShippingLabelSettings from './components/ShippingLabelSettings';
import ShippingCost from './components/ShippingCost';
import ShippingInfo from './components/ShippingInfo';
import ShippingMailType from './components/ShippingMailType';
import ShippingLabelSize from './components/ShippingLabelSize';
import ShippingWeights from './components/ShippingWeights';
// import ShippingPackingSlip from './ShippingPackingSlip';

import {createUseStyle} from 'theme';
import {Constants, SchemaTypes} from 'globals';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {showErrorAlert} from 'utils';

const ShippingSettingsPage = (props) => {
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
    query ShippingSettingsPageQuery {
      viewer {
        addresses {
          id
          name
        }
        sellerSettings {
          id
          buyerPaysShipping
          shippingLabelGeneratedBy
          shippingPackageType
          shippingLabelSize
          # packingSlip
          shippingCost
          shippingInfo
          shippingWeightForGradedCards {
            unit
            value
          }
          shippingWeightForRawCards {
            unit
            value
          }
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const {addresses, sellerSettings} = viewerData.viewer || {}

  const [isBuyerPaysShipping, setIsBuyerPaysShipping] = useState(sellerSettings?.buyerPaysShipping);
  const [shippingLabel, setLabelSetting] = useState(
    sellerSettings?.shippingLabelGeneratedBy || SchemaTypes.shippingLabelGeneratedBy.OWN,
  );
  const [shippingCost, setShippingCost] = useState(Number(sellerSettings?.shippingCost || 0) / 100);
  const [shippingInfo, setShippingInfo] = useState(sellerSettings?.shippingInfo || '');
  // const [isPackingSlip, setIsPackingSlip] = useState(sellerSettings?.packingSlip);

  const [mailType, setMailType] = useState(
    sellerSettings?.shippingPackageType || SchemaTypes.shippingPackageType.ENVELOPE,
  );
  const [labelSize, setLabelSize] = useState(
    sellerSettings?.shippingLabelSize || SchemaTypes.shippingLabelSize.EIGHT_AND_A_HALF_BY_ELEVEN,
  );
  const [rawWeight, setRawWeight] = useState(sellerSettings?.shippingWeightForRawCards?.value);
  const [gradedWeight, setGradedWeight] = useState(sellerSettings?.shippingWeightForGradedCards?.value);

  const [isSaving, setIsSaving] = useState(false);

  const isRawWeightError = isBuyerPaysShipping && Number(rawWeight) < Constants.minimumRawWeight;
  const isGradedWeightError = isBuyerPaysShipping && Number(gradedWeight) < Constants.minimumGradedWeight;

  const prevLabelSetting = useRef(null);

  const shippingAddress = useMemo(() => (
    addresses?.find(item => item.name === Constants.addressName.shipping)
  ), [addresses]);

  useEffect(() => {
    setNavigationBar();
  }, [
    isBuyerPaysShipping,
    shippingLabel,
    shippingCost,
    shippingInfo,
    // isPackingSlip,
    mailType,
    labelSize,
    rawWeight,
    gradedWeight,
    isRawWeightError,
    isGradedWeightError,
  ]);

  useEffect(() => {
    if (!shippingAddress || !prevLabelSetting.current) {
      setLabelSetting(sellerSettings?.shippingLabelGeneratedBy || SchemaTypes.shippingLabelGeneratedBy.OWN);
      return;
    }

    setLabelSetting(prevLabelSetting.current);
    prevLabelSetting.current = null;
  }, [shippingAddress, sellerSettings?.shippingLabelGeneratedBy]);

  const setNavigationBar = () => {
    const disabled = isBuyerPaysShipping && (
      (shippingLabel === SchemaTypes.shippingLabelGeneratedBy.COLLX && (isRawWeightError || isGradedWeightError)) ||
      (shippingLabel === SchemaTypes.shippingLabelGeneratedBy.ME && (!shippingCost || Number(shippingCost) < 0 || !shippingInfo))
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
          disabled={disabled}
          label="Save"
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleChangeMailType = (mailType) => {
    setMailType(mailType);

    if (mailType === SchemaTypes.shippingPackageType.ENVELOPE) {
      setLabelSize(SchemaTypes.shippingLabelSize.FOUR_BY_SIX);
    }
  };

  const handleSave = () => {
    setIsSaving(true);

    actions.setSellerShippingSettings({
      buyerPaysShipping: isBuyerPaysShipping,
      shippingLabelGeneratedBy: shippingLabel,
      shippingPackageType: mailType,
      // packingSlip: isPackingSlip,
      shippingLabelSize: labelSize,
      shippingCost: shippingCost ? Number(shippingCost) * 100 : 0,
      shippingInfo,
      shippingWeightForGradedCards: {
        unit: sellerSettings?.shippingWeightForGradedCards?.unit || SchemaTypes.unitOfMeasureForWeight.OUNCE,
        value: parseFloat(gradedWeight),
      },
      shippingWeightForRawCards: {
        unit: sellerSettings?.shippingWeightForRawCards?.unit || SchemaTypes.unitOfMeasureForWeight.OUNCE,
        value: parseFloat(rawWeight),
      }
    }, {
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

  const handleChangeShippingLabel = (value) => {
    if (value === SchemaTypes.shippingLabelGeneratedBy.COLLX && !shippingAddress) {
      Alert.alert(
        'Must provide shipping address',
        'In order for CollX to generate shipping labels for you, you must first provide you shipping address.',
        [
          {
            text: 'Go back',
            style: 'cancel',
          },
          {
            text: 'Add address',
            onPress: () => {
              prevLabelSetting.current = value;
              navigation.navigate('ShippingAddressScreens');
            },
          },
        ],
      );
      return;
    }

    prevLabelSetting.current = null;

    setLabelSetting(value);
  };

  return (
    <KeyboardAvoidingScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LoadingIndicator isLoading={isSaving} />
      <Switch
        style={styles.switchBuyerPaysShipping}
        label="Buyer pays shipping"
        value={isBuyerPaysShipping}
        onChangedValue={setIsBuyerPaysShipping}
      />
      <ShippingLabelSettings
        value={shippingLabel}
        onChangeValue={handleChangeShippingLabel}
      />
      {shippingLabel === SchemaTypes.shippingLabelGeneratedBy.COLLX ? (
        <>
          <ShippingMailType
            value={mailType}
            onChangeValue={handleChangeMailType}
          />
          {mailType === SchemaTypes.shippingPackageType.PACKAGE ? (
            <ShippingLabelSize
              value={labelSize}
              onChangeValue={setLabelSize}
            />
          ) : null}
          <ShippingWeights
            rawWeight={rawWeight.toString()}
            rawWeightUnit={sellerSettings?.shippingWeightForRawCards?.unit}
            isRawWeightError={isRawWeightError}
            isGradedWeightError={isGradedWeightError}
            gradedWeight={gradedWeight.toString()}
            gradedWeightUnit={sellerSettings?.shippingWeightForGradedCards?.unit}
            onChangeRawWeight={setRawWeight}
            onChangeGradedWeight={setGradedWeight}
          />
        </>
      ) : (
        <>
          <ShippingCost
            value={shippingCost.toString()}
            onChangeValue={setShippingCost}
          />
          <ShippingInfo
            value={shippingInfo}
            onChangeValue={setShippingInfo}
          />
        </>
      )}
      {/* <ShippingPackingSlip
        value={isPackingSlip}
        onChangeValue={setIsPackingSlip}
      /> */}
    </KeyboardAvoidingScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  switchBuyerPaysShipping: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    marginTop: 20,
  },
}));

export default ShippingSettingsPage;
