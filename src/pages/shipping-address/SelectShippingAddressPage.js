import React, {Suspense, useState, useCallback, useMemo, useRef} from 'react';
import {View, Text, SectionList} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

import {
  LoadingIndicator,
  Button,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import SelectShippingAddressItem from './components/SelectShippingAddressItem';

import {Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants, SchemaTypes} from 'globals';
import {showErrorAlert, showAlert} from 'utils';

const defaultActionLabels = ['Edit Address', 'Delete Address', 'Cancel'];
const normalActionLabels = ['Edit Address', 'Set as Default', 'Delete Address', 'Cancel'];

const SelectShippingAddressPage = (props) => {
  const {navigation} = props;

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

  const insets = useSafeAreaInsets();

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query SelectShippingAddressPageQuery {
      viewer {
        defaultAddress {
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

  const {
    defaultAddress,
    addresses,
    sellerSettings,
  } = viewerData?.viewer || {};

  const actionSheetRef = useRef(null);
  const currentAddress = useRef(null);
  const [currentActionLabels, setCurrentActionLabels] = useState([]);
  const [isSettingDefaultAddress, setIsSettingDefaultAddress] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  const shippingAddresses = useMemo(() => {
    if (!addresses.length) {
      return [];
    }

    const shippingAddresses = [];

    if (defaultAddress) {
      shippingAddresses.push({
        title: 'Default',
        data: [
          defaultAddress,
        ],
      });
    }

    const others = [];
    addresses.forEach((address) => {
      if (address?.id === defaultAddress?.id || address?.name === Constants.addressName.tax) {
        return;
      }

      others.push(address);
    });

    if (others.length) {
      shippingAddresses.push({
        title: 'Others',
        data: others,
      });
    }

    return shippingAddresses;
  }, [defaultAddress, addresses]);

  const handleConfirmAddress = address => {
    if (shippingAddresses.length < 2 && sellerSettings?.shippingLabelGeneratedBy === SchemaTypes.shippingLabelGeneratedBy.COLLX) {
      showAlert(
        'Shipping address required',
        'You must have a default shipping address in order for CollX to generate shipping labels for you.',
      );
      return;
    }

    handleDeleteAddress(address);
  };

  const handleDeleteAddress = address => {
    if (!address?.id) {
      return;
    }

    setIsDeletingAddress(true);

    actions.deleteAddress(
      address.id,
      {
        onComplete: () => {
          setIsDeletingAddress(false);
        },
        onError: (error) => {
          console.log(error);
          setIsDeletingAddress(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleSetDefaultAddress = address => {
    if (!address?.id) {
      return;
    }

    setIsSettingDefaultAddress(true);

    actions.setDefaultAddress(
      address.id,
      {
        onComplete: () => {
          setIsSettingDefaultAddress(false);
        },
        onError: (error) => {
          console.log(error);
          setIsSettingDefaultAddress(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleChangeAddress = address => {
    const onSelectAddress = route.params?.onSelectAddress;

    if (onSelectAddress) {
      onSelectAddress(address);
      navigation.goBack();
      return;
    }

    handleEditAddress(address);
  };

  const handleEditAddress = address => {
    actions.navigateAddEditShippingAddress({
      address
    });
  };

  const handleActionMore = (address, sectionTitle) => {
    currentAddress.current = address;

    if (sectionTitle === 'Default') {
      setCurrentActionLabels(defaultActionLabels);
    } else {
      setCurrentActionLabels(normalActionLabels);
    }

    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleAddAddress = () => {
    actions.navigateAddEditShippingAddress();
  };

  const handleSelectAction = async index => {
    switch (currentActionLabels[index]) {
      case 'Edit Address':
        // Edit Address
        if (currentAddress.current) {
          handleEditAddress(currentAddress.current);
        }
        break;
      case 'Set as Default':
        // Set as Default
        handleSetDefaultAddress(currentAddress.current);
        break;
      case 'Delete Address':
        // Delete Address
        handleConfirmAddress(currentAddress.current);
        break;
    }

    currentAddress.current = null;
    setCurrentActionLabels([]);
  };

  const renderSectionHeader = ({section}) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.textSectionTitle}>{section.title}</Text>
    </View>
  );

  const renderItem = ({item, section}) => (
    <SelectShippingAddressItem
      address={item}
      onSelect={handleChangeAddress}
      onEdit={(address) => handleActionMore(address, section.title)}
    />
  );

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <View style={styles.container}>
          <LoadingIndicator isLoading={isDeletingAddress || isSettingDefaultAddress} />
          <SectionList
            style={styles.sectionContainer}
            sections={shippingAddresses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            refreshing={false}
            onRefresh={actions.handleRefresh}
          />
          <Button
            style={[styles.addButton, !tabBarHeight && {marginBottom:  insets.bottom || 22}]}
            label="Add New Address"
            labelStyle={styles.textAddButton}
            scale={Button.scaleSize.One}
            onPress={handleAddAddress}
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
  sectionHeaderContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.secondaryBackground,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    textTransform: 'uppercase',
  },
  addButton: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 22,
    borderColor: colors.primary,
  },
  textAddButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: colors.primary,
  },
}));

export default SelectShippingAddressPage;
