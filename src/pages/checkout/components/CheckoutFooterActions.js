import React from 'react';
import {View, Platform} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PlatformPayButton, PlatformPay} from '@stripe/stripe-react-native';

import {
  Button,
} from 'components';
import CheckoutErrorView from './CheckoutErrorView';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {Constants} from 'globals';

const CheckoutFooterActions = ({
  order,
  paymentMethod,
  tabBarHeight,
  onSubmitOrder,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyle();
  const {selectedTheme} = useTheme();

  const orderData = useFragment(graphql`
    fragment CheckoutFooterActions_order on Order {
      viewer {
        canICheckout
        ...CheckoutErrorView_orderViewer
      }
    }`,
    order
  );

  const handleSubmitOrder = () => {
    if (onSubmitOrder) {
      onSubmitOrder();
    }
  };

  const renderPayButton = () => {
    if (paymentMethod?.type === Constants.paymentMethodTypes.apple || paymentMethod?.type === Constants.paymentMethodTypes.google) {
      // Apple Pay or Google Pay
      return (
        <PlatformPayButton
          style={Platform.select({
            ios: styles.appleButton,
            android: selectedTheme === Constants.colorSchemeName.dark ? styles.googleDarkButton : styles.googleButton,
          })}
          type={Platform.select({
            ios: PlatformPay.ButtonType.InStore,
            android: PlatformPay.ButtonType.Pay,
          })}
          appearance={
            selectedTheme === Constants.colorSchemeName.dark ? PlatformPay.ButtonStyle.White : PlatformPay.ButtonStyle.Black
          }
          borderRadius={10}
          onPress={handleSubmitOrder}
        />
      );
    }

    return (
      <Button
        style={styles.submitOrderButton}
        label="Submit Order"
        labelStyle={styles.textSubmitOrder}
        scale={Button.scaleSize.One}
        disabled={!orderData.viewer.canICheckout}
        onPress={handleSubmitOrder}
      />
    );
  };

  return (
    <View style={[styles.container, !tabBarHeight && {marginBottom: insets.bottom || 12}]}>
      <CheckoutErrorView orderViewer={orderData.viewer} />
      {renderPayButton()}
    </View>
  );
};

export default CheckoutFooterActions;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  submitOrderButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  textSubmitOrder: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: Colors.white,
  },
  appleButton: {
    width: '100%',
    height: 44,
  },
  googleButton: {
    width: '100%',
    height: 52,
  },
  googleDarkButton: {
    width: '100%',
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.softGray,
  },
}));
