import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';

import {
  KeyboardAvoidingScrollView,
  LoadingIndicator,
  Button,
  Dropdown,
  ShippingAddress,
} from 'components';

import {Constants, Styles, UserCardCategories} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {usePrevious} from 'hooks';
import {withRedeemReward} from 'store/containers';
import {setStorageItem, showErrorAlert} from 'utils';
import ActionContext, {useActions} from 'actions';

const RedeemReward = props => {
  const {
    navigation,
    user,
    isFetchingAddress,
    isFetchingReferral,
    newReward,
    addresses,
    errorText,
    getAddresses,
    setReward,
  } = props;

  const styles = useStyle();

  const actions = useActions();

  const prevProps = usePrevious({newReward, errorText});

  const packTypes = UserCardCategories.slice(0, 5).map(item => ({
    label: item.label,
    value: item.label.toLowerCase(),
    icon: item.icon,
  }));

  const [currentAddress, setCurrentAddress] = useState({});
  const [currentPackType, setCurrentPackType] = useState(packTypes[0].value);

  const {address1, address2, city, state, postalCode} = currentAddress;

  useEffect(() => {
    setNavigationBar();
  }, []);

  useEffect(() => {
    if (user?.id) {
      getAddresses({userId: user.id});
    }
  }, [user?.id]);

  useEffect(() => {
    if (!addresses?.length) {
      return;
    }

    setCurrentAddress(addresses[0]);
  }, [addresses]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (!prevProps.newReward && newReward) {
      actions.redeemReward();

      setStorageItem(Constants.dismissedReferralProgram, 'true');
      navigation.navigate('RedeemRewardSuccess');
    }
  }, [newReward]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (!prevProps.errorText && errorText) {
      showErrorAlert(errorText);
    }
  }, [errorText]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Redeem Reward',
    });
  };

  const handleChangeAddress = address => {
    setCurrentAddress(address);
  };

  const handleChangePackType = value => {
    setCurrentPackType(value);
  };

  const handleRedeemReward = () => {
    actions.redeemReward();

    const rewardAddress = {
      careOf: user.name,
      name: Constants.addressName.shipping,
      address1,
      city,
      state,
      postalCode,
    };

    if (address2) {
      rewardAddress.address2 = address2;
    }

    setReward({
      userId: user.id,
      data: {
        packType: currentPackType,
      },
      address: rewardAddress,
    });
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <LoadingIndicator isLoading={isFetchingAddress || isFetchingReferral} />
        <KeyboardAvoidingScrollView bottomOffset={Styles.bottomTabBarHeight}>
          <View style={styles.contentContainer}>
            <Text style={styles.textDescription}>
              Thanks for referring 5 of your friends! Choose a pack type and fill
              out your shipping info to redeem your reward.
            </Text>
            <Text style={styles.textFieldName}>Pack Type Preference</Text>
            <Dropdown
              style={styles.dropdownContainer}
              textStyle={styles.textDropdown}
              dropDownItemTextStyle={styles.textDropdownItem}
              placeholder="Pack Type"
              data={packTypes}
              value={currentPackType}
              onChangedValue={handleChangePackType}
            />
            <ShippingAddress
              address={currentAddress}
              onChangeAddress={handleChangeAddress}
            />
            <View style={styles.shippingMethodContainer}>
              <Text style={styles.textShippingMethod}>Shipping Method</Text>
              <Text style={styles.textDescription}>
                Ships via standard shipping (5-7 Business Days)
              </Text>
            </View>
          </View>
          <Button
            style={styles.button}
            label="Redeem Reward"
            labelStyle={styles.textButton}
            scale={Button.scaleSize.One}
            disabled={!address1 || !city || !state || !postalCode}
            onPress={handleRedeemReward}
          />
        </KeyboardAvoidingScrollView>
      </View>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginVertical: 12,
  },
  shippingMethodContainer: {
    marginVertical: 12,
  },
  textShippingMethod: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
  },
  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    color: Colors.white,
  },
  dropdownContainer: {
    width: '100%',
    height: 48,
  },
  textDropdown: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    letterSpacing: -0.41,
    color: colors.primary,
  },
  textDropdownItem: {
    fontWeight: Fonts.normal,
    color: colors.primaryText,
  },
}));

export default withRedeemReward(RedeemReward);
