import React, {Suspense, useState, useEffect, useCallback, useMemo} from 'react';
import {View, Text, TextInput} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  NavBarButton,
  LoadingIndicator,
  ShippingAddress,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {Constants} from 'globals';
import {showErrorAlert} from 'utils';

const NameAndAddressPage = (props) => {
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

const Content = props => {
  const {navigation, queryOptions} = props;

  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query NameAndAddressPageQuery {
      viewer {
        profile {
          name
        }
        addresses {
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
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const {
    sellerSettings,
    addresses,
    profile,
  } = viewerData?.viewer || {};

  const taxAddress = useMemo(() => (
     addresses?.find(item => item.name === Constants.addressName.tax)
  ), [addresses]);

  const [isSaving, setIsSaving] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    ...(sellerSettings?.address || taxAddress || {}),
    careOf: sellerSettings?.address?.careOf || taxAddress?.careOf || profile?.name,
  });

  useEffect(() => {
    setNavigationBar();
  }, [currentAddress]);

  const setNavigationBar = () => {
    const {
      address1,
      city,
      state,
      careOf,
      postalCode,
    } = currentAddress;

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
          disabled={!address1 || !careOf || !city || !state || !postalCode}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    const {
      address1,
      address2,
      city,
      state,
      country,
      careOf,
      postalCode,
    } = currentAddress;

    const newAddress = {
      address1,
      address2,
      careOf,
      city,
      country,
      name: Constants.addressName.tax,
      postalCode,
      state,
    };

    setIsSaving(true);

    if (currentAddress?.id) {
      actions.updateAddress(
        currentAddress?.id,
        newAddress,
        {
          onComplete: () => {
            handleSaveTaxInfo(currentAddress?.id);
          },
          onError: (error) => {
            console.log(error);
            setIsSaving(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          },
        },
      );
    } else {
      actions.createAddress(
        newAddress,
        {
          onComplete: (address) => {
            handleSaveTaxInfo(address?.id);
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
    }
  };

  const handleSaveTaxInfo = (addressId) => {
    if (!addressId) {
      setIsSaving(false);
      return;
    }

    const params = {
      sellerType: sellerSettings?.sellerType,
      ssn: sellerSettings?.ssn,
      tin: sellerSettings?.tin,
      with: {
        addressId,
      }
    };

    actions.setSellerTaxpayerInformation(params, {
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
    });
  };

  const handleChangeFullName = value => {
    setCurrentAddress({
      ...currentAddress,
      careOf: value,
    });
  }

  const handleChangeAddress = address => {
    setCurrentAddress({
      ...currentAddress,
      ...address,
    });
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator isLoading={isSaving} />
      <Text style={styles.textSectionTitle}>
        Your Full Name
      </Text>
      <TextInput
        style={styles.textInputFullName}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder="Full Name"
        placeholderTextColor={colors.placeholderText}
        value={currentAddress?.careOf}
        maxLength={Constants.nameMaxLength}
        onChangeText={handleChangeFullName}
      />
      <ShippingAddress
        style={styles.addressContainer}
        address={currentAddress}
        onChangeAddress={handleChangeAddress}
      />
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
  addressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  textInputFullName: {
    height: 40,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 2,
    color: colors.primaryText,
    backgroundColor: colors.secondaryCardBackground,
    marginVertical: 10,
    marginHorizontal: 16,
  },
}));

export default NameAndAddressPage;
