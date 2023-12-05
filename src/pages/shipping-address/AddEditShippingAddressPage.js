import React, {Suspense, useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

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

const AddEditShippingAddressPage = (props) => {
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
  const {navigation, route, queryOptions} = props;
  const address = route.params?.address;

  const insets = useSafeAreaInsets();
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query AddEditShippingAddressPageQuery {
      viewer {
        profile {
          name
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const [isSaving, setIsSaving] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    ...(address || {}),
    careOf: address?.careOf || viewerData?.viewer?.profile?.name,
  });

  useEffect(() => {
    setNavigationBar();
  }, [currentAddress]);

  const setNavigationBar = () => {
    const {address1, city, state, careOf, postalCode} = currentAddress;
    const isDisabledSave = !address1 || !careOf?.trim() || !city || !state || !postalCode;

    navigation.setOptions({
      title: address ? 'Edit Shipping Info' : 'Add Shipping Info',
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
          disabled={isDisabledSave}
          onPress={handleSave}
        />
      ),
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    const {address1, address2, city, state, country, careOf, postalCode} = currentAddress;

    setIsSaving(true);

    const newAddress = {
      address1,
      address2,
      careOf: careOf?.trim(),
      city,
      country: country || 'US',
      name: Constants.addressName.shipping,
      postalCode,
      state,
    };

    if (address && currentAddress?.id) {
      // Edit
      actions.updateAddress(
        currentAddress.id,
        newAddress,
        {
          onComplete: () => {
            setIsSaving(false);
            handleCancel();
          },
          onError: (error) => {
            console.log(error);
            setIsSaving(false);

            if (error?.message) {
              showErrorAlert(error.message);
            }
          },
        },
      );
    } else {
      // Create
      actions.createAddress(
        newAddress,
        {
          onComplete: () => {
            setIsSaving(false);
            handleCancel();
          },
          onError: (error) => {
            console.log(error);
            setIsSaving(false);

            if (error?.message) {
              showErrorAlert(error.message);
            }
          },
        },
      );
    }
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
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <KeyboardAvoidingScrollView style={styles.container}>
          <LoadingIndicator isLoading={isSaving} />
          <Text style={styles.textSectionTitle}>
            Name
          </Text>
          <TextInput
            style={styles.textInputName}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholder="Your Name"
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
          <Text style={[styles.textNote, !tabBarHeight && {marginBottom: insets.bottom || 12}]}>
            Please note that at this time we are only accepting addresses within the United States.
          </Text>
        </KeyboardAvoidingScrollView>
      )}
    </BottomTabBarHeightContext.Consumer>
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
  textInputName: {
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
  textNote: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
}));

export default AddEditShippingAddressPage;
