/* eslint-disable no-undef */
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {View, ScrollView, RefreshControl, Alert, Platform} from 'react-native';
import {graphql, useLazyLoadQuery, useSubscription} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';
import {
  useApplePay,
  useGooglePay,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

import {
  LoadingIndicator,
  NavBarButton,
  DealUser,
  OrderDetail,
  PaymentMethod,
  SellerDiscountInfo,
  SellerShippingInfo,
  ShipTo,
  DueAtCountdown,
} from 'components';
import CheckoutFooterActions from './components/CheckoutFooterActions';

import {useActions} from 'actions';
import {Constants, SchemaTypes} from 'globals';
import {createUseStyle, useTheme} from 'theme';
import {withCheckout} from 'store/containers';
import {
  showErrorAlert,
  getChargeBreakdownValue,
} from 'utils';
import {
  analyticsEvents,
  analyticsSendEvent,
  customerTrack,
  singularEvent,
} from 'services';

const ellipsisIcon = require('assets/icons/ellipsis.png');

const CheckoutContent = (props) => {
  const {
    navigation,
    route,
    queryOptions,
    isFetchingPaymentMethod,
    paymentMethods,
    otherPaymentMethods,
    getPaymentMethod,
    setEmailVerifiedAction,
  } = props;

  const {
    orderId,
    ordersWithUserAs,
  } = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const {
    confirmPayment,
    loading: isLoadingConfirmPayment,
  } = useConfirmPayment();
  const {
    isApplePaySupported,
    presentApplePay,
    confirmApplePayPayment
  } = useApplePay();
  const {
    isGooglePaySupported,
    initGooglePay,
    presentGooglePay,
  } = useGooglePay();

  const subscriptionConfig = useMemo(() => ({
    variables: {orderId},
    subscription: graphql`
      subscription CheckoutContentSubscription($orderId: ID!) {
        orderChanged(id: $orderId) {
          nextAction
          nextActionDueAt
          chargeBreakdown {
            type
            value {
              amount
              formattedAmount
            }
          }
          shippingAddress {
            id
            careOf
            address1
            address2
            city
            state
            postalCode
          }
          viewer {
            canICancel
            canICheckout
            reasonICantCheckout
          }
        }
      }`
    ,
    onError: (error) => {
      console.log(error);
    },
  }), [orderId]);

  useSubscription(subscriptionConfig);

  const queryData = useLazyLoadQuery(
    graphql`
      query CheckoutContentQuery($id: ID!) {
        order(with: {id: $id}) {
          id
          state
          number
          nextAction
          nextActionDueAt
          buyer {
            id
            name
          }
          seller {
            id
            name
            ...DealUser_other_profile
          }
          deal {
            id
            ...SellerDiscountInfo_deal
            ...SellerShippingInfo_deal
            ...DueAtCountdown_deal
          }
          shippingAddress {
            id
            ...ShipTo_address
          }
          paymentDetails {
            stripePaymentMethod
          }
          chargeBreakdown {
            type
            value {
              amount
              formattedAmount
            }
          }
          ...OrderDetail_order
          ...CheckoutFooterActions_order
          ...DueAtCountdown_order
        }
        viewer {
          engagement
          profile {
            ...DealUser_my_profile
            ...SellerDiscountInfo_profile
            ...SellerShippingInfo_profile
          }
          buyerSettings {
            stripeCustomerId
            stripeDefaultPaymentMethodId
          }
        }
      }
    `,
    {
      id: orderId
    },
    queryOptions,
  );

  const {
    stripeCustomerId,
    stripeDefaultPaymentMethodId,
  } = queryData.viewer.buyerSettings || {};

  const isMeBuyer = ordersWithUserAs === SchemaTypes.ordersWithMeAs.BUYER;

  const [isSettingShippingAddress, setIsSettingShippingAddress] = useState(false);
  const [isCancelingCheckout, setIsCancelingCheckout] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);

  const actionSheetRef = useRef(null);

  const chargePrices = useMemo(() => ({
    dueAtCheckout: getChargeBreakdownValue(queryData.order.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.DUE_AT_CHECKOUT),
    subTotal: getChargeBreakdownValue(queryData.order.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.SUBTOTAL)
  }), [queryData.order.chargeBreakdown]);

  const totalPrice = Number(chargePrices.dueAtCheckout.amount) || 0;

  useEffect(() => {
    setNavigationBar();
  }, [queryData.order?.state]);

  useEffect(() => {
    const paymentMethodId = queryData.order?.paymentDetails?.stripePaymentMethod || stripeDefaultPaymentMethodId;

    if (!paymentMethodId) {
      return;
    } else if (paymentMethodId === Constants.extraPaymentMethods.apple.id) {
      setCurrentPaymentMethod(Constants.extraPaymentMethods.apple);
      return;
    } else if (paymentMethodId === Constants.extraPaymentMethods.google.id) {
      setCurrentPaymentMethod(Constants.extraPaymentMethods.google);
      return;
    }

    let paymentMethod = paymentMethods.find(item => item.id === paymentMethodId);
    if (paymentMethod) {
      setCurrentPaymentMethod(paymentMethod);
      return;
    }

    paymentMethod = otherPaymentMethods.find(item => item.id === paymentMethodId);
    if (paymentMethod) {
      setCurrentPaymentMethod(paymentMethod);
      return;
    }

    getPaymentMethod(paymentMethodId);
  }, [
    stripeDefaultPaymentMethodId,
    queryData.order?.paymentDetails?.stripePaymentMethod,
    paymentMethods,
    otherPaymentMethods,
  ]);

  const setNavigationBar = () => {
    const state = queryData.order?.state;
    navigation.setOptions({
      headerRight: () => (
        state === SchemaTypes.orderState.CREATED || state === SchemaTypes.orderState.AWAITING_PAYMENT ? (
          <NavBarButton
            icon={ellipsisIcon}
            iconStyle={styles.iconMoreAction}
            onPress={handleMoreAction}
          />
        ) : null
      ),
    });
  };

  const confirmCardPay = async (clientSecret, stripePaymentMethodId) => {
    if (!clientSecret || !stripePaymentMethodId) {
      return;
    }

    const {error: confirmPaymentError} = await confirmPayment(
      clientSecret,
      {
        paymentMethodType: 'Card',
        paymentMethodData: {
          // billingDetails,
          paymentMethodId: stripePaymentMethodId,
        },
      }
    );

    if (confirmPaymentError?.message) {
      showErrorAlert(confirmPaymentError.message);
      return;
    }

    navigateOrderDetail();
  };

  const displayApplePaySheet = async () => {
    if (!isApplePaySupported) {
      showErrorAlert('Apple Pay is not supported');
      return;
    }

    const {error: presentApplePayError, paymentMethod: applyPaymentMethod} = await presentApplePay({
      cartItems: [
        {
          label: 'CollX Order',
          amount: chargePrices.dueAtCheckout.amount,
          paymentType: 'Immediate',
        },
      ],
      country: 'US',
      currency: SchemaTypes.currencyCode.USD,
      // shippingMethods: [
      //   {
      //     amount: '20.00',
      //     identifier: 'DPS',
      //     label: 'Courier',
      //     detail: 'Delivery',
      //   },
      // ],
      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    });

    if (presentApplePayError?.message) {
      showErrorAlert(presentApplePayError.message);
    } else if (applyPaymentMethod?.id && stripeCustomerId) {
      submitOrder(applyPaymentMethod.id);
    }
  };

  const confirmApplePay = async (clientSecret) => {
    if (!clientSecret) {
      return;
    }

    const {error: confirmApplePayError} = await confirmApplePayPayment(clientSecret);

    if (confirmApplePayError?.message) {
      showErrorAlert(confirmApplePayError.message);
      return;
    }

    navigateOrderDetail();
  }

  const payGooglePay = async () => {
    if (!await isGooglePaySupported({
      testEnv: __DEV__,
    })) {
      showErrorAlert('Google Pay is not supported');
      return;
    }

    const {error: initGooglePayError} = await initGooglePay({
      testEnv: __DEV__,
      // merchantName: 'Test',
      countryCode: 'US',
      billingAddressConfig: {
        format: 'FULL',
        isPhoneNumberRequired: true,
        isRequired: false,
      },
      existingPaymentMethodRequired: true,
      isEmailRequired: true,
    });

    if (initGooglePayError?.message) {
      showErrorAlert(initGooglePayError.message);
      return;
    } else if (stripeCustomerId) {
      submitOrder();
    }
  };

  const confirmGooglePay = async (clientSecret) => {
    if (!clientSecret) {
      return;
    }

    const {error: presentGooglePayError} = await presentGooglePay({
      clientSecret,
      forSetupIntent: false,
    });

    if (presentGooglePayError?.message) {
      showErrorAlert(presentGooglePayError.message);
      return;
    }

    navigateOrderDetail();
  };

  const sendSuccessEvent = async () => {
    const {
      number,
      seller,
      buyer,
    } = queryData.order || {};

    const {engagement} = queryData.viewer || {};

    let eventName = analyticsEvents.orderSucceeded;

    if (!engagement.includes(Constants.userEngagement.ordered)) {
      eventName = analyticsEvents.firstOrderSucceeded;

      actions.addEngagement(Constants.userEngagement.ordered);
    }

    const attributes = {
      amount: chargePrices?.subTotal?.amount,
      order_number: number,
      buyer_id: buyer?.id,
      buyer_name: buyer?.name,
      seller_id: seller?.id,
      seller_name: seller?.name,
      platform: Platform.OS,
    };

    // custom event
    analyticsSendEvent(eventName, attributes);

    // customer io
    customerTrack(eventName, attributes);

    // singular
    singularEvent(eventName, attributes);
  };

  const submitOrder = (stripePaymentMethod) => {
    if (!queryData.order?.id) {
      return;
    }

    setIsSubmittingOrder(true);

    actions.checkoutOrder(
      queryData.order?.id,
      stripePaymentMethod,
      {
        onComplete: (order) => {
          setIsSubmittingOrder(false);
          checkSubmittedOrder(order);

          sendSuccessEvent();
        },
        onError: (error) => {
          console.log(error);
          setIsSubmittingOrder(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const checkSubmittedOrder = order => {
    const {paymentDetails} = order || {};

    if (!currentPaymentMethod || !paymentDetails?.stripeClientSecret) {
      // Credit / Balance Applied
      navigateOrderDetail();
    } else if (currentPaymentMethod?.type === Constants.paymentMethodTypes.apple) {
      // Apple Pay
      confirmApplePay(paymentDetails?.stripeClientSecret);
    } else if (currentPaymentMethod?.type === Constants.paymentMethodTypes.google) {
      // Google Pay
      confirmGooglePay(paymentDetails?.stripeClientSecret);
    } else if (currentPaymentMethod?.type === Constants.paymentMethodTypes.card) {
      // Card Pay
      confirmCardPay(paymentDetails?.stripeClientSecret, paymentDetails?.stripePaymentMethod);
    }
  };

  const navigateOrderDetail = () => {
    actions.navigateCheckoutOrder({
      orderId,
      isFromCheckout: true,
    });
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleMoreAction = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleSelectAction = async index => {
    switch (index) {
      case 0: {
        // Cancel Order
        Alert.alert(
          'Are you sure you want to cancel this order?',
          'No problem. You can always start a fresh order with the seller again.',
          [
            {
              text: 'Yes',
              onPress: handleCancelCheckout,
            },
            {
              text: 'No',
            },
          ],
        );
        break;
      }
    }
  };

  const handleCancelCheckout = () => {
    if (!queryData.order?.id) {
      return;
    }

    setIsCancelingCheckout(true);

    actions.cancelOrder(
      queryData.order.id,
      {
        onComplete: () => {
          setIsCancelingCheckout(false);
          navigation.goBack();
        },
        onError: (error) => {
          console.log(error);
          setIsCancelingCheckout(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleSelectShippingAddress = address => {
    if (!queryData.order?.id || !address?.id) {
      return;
    }

    setIsSettingShippingAddress(true);

    actions.setShippingAddress(
      queryData.order.id,
      address.id,
      {
        onComplete: () => {
          setIsSettingShippingAddress(false);
        },
        onError: (error) => {
          console.log(error);
          setIsSettingShippingAddress(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      }
    );
  };

  const handleSelectPaymentMethod = (payment, isNeedSubmit = false) => {
    setCurrentPaymentMethod(payment);

    if (!queryData.order?.id || !payment?.id) {
      return;
    }

    actions.setStripePaymentMethod(
      queryData.order.id,
      payment.id,
      {
        onComplete: () => {
          if (isNeedSubmit) {
            submitOrder(payment.id);
          }
        },
        onError: (error) => {
          console.log(error);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      }
    );
  };

  const handleAddShippingAddress = () => {
    actions.navigateSelectShippingAddress({
      onSelectAddress: handleSelectShippingAddress,
    });
  };

  const handleChangeShippingAddress = () => {
    actions.navigateSelectShippingAddress({
      onSelectAddress: handleSelectShippingAddress,
    });
  };

  const handleAddPaymentMethod = () => {
    actions.navigateSelectPaymentMethod({
      onSelectPayment: handleSelectPaymentMethod,
    });
  };

  const handleChangePaymentMethod = () => {
    actions.navigateSelectPaymentMethod({
      onSelectPayment: handleSelectPaymentMethod,
    });
  };

  const handleSelectCard = (tradingCardId) => {
    actions.pushTradingCardDetail(tradingCardId);
  };

  const handleCheckSubmitOrder = () => {
    setEmailVerifiedAction(handleSubmitOrder);
  };

  const handleSubmitOrder = async () => {
    if (!queryData.order?.shippingAddress) {
      showErrorAlert('Please add shipping address.');
      return;
    }

    if (totalPrice <= 0) {
      // Credit Applied or Balance Applied
      submitOrder();
      return;
    }

    if (currentPaymentMethod?.type === Constants.paymentMethodTypes.apple) {
      // Apple Pay
      displayApplePaySheet(/* totalPrice */);
    } else if (currentPaymentMethod?.type === Constants.paymentMethodTypes.google) {
      // Google Pay
      payGooglePay(/* totalPrice */);
    } else if (currentPaymentMethod?.type === Constants.paymentMethodTypes.card && stripeCustomerId) {
      // Card Pay
      if (!queryData.order?.paymentDetails?.stripePaymentMethod) {
        // Sets current payment method before submitting
        handleSelectPaymentMethod(currentPaymentMethod, true);
        return;
      }

      submitOrder(currentPaymentMethod.id);
    } else {
      showErrorAlert('Please attach a payment method.');
    }
  };

  const handleMessage = (currentProfileId, peerProfileId, isRootScreen) => {
    setEmailVerifiedAction(() => {
      actions.navigateMessage({
        currentProfileId,
        peerProfileId,
        isRootScreen,
      });
    });
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <View style={styles.container}>
          <LoadingIndicator
            isLoading={
              isLoadingConfirmPayment ||
              isSettingShippingAddress ||
              isCancelingCheckout ||
              isFetchingPaymentMethod ||
              isSubmittingOrder
            }
          />
          <DueAtCountdown
            isMeBuyer={isMeBuyer}
            deal={queryData.order?.deal}
            order={queryData.order}
          />
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={false}
                tintColor={colors.primary}
                onRefresh={handleRefresh}
              />
            }
          >
            <DealUser
              myProfile={queryData.viewer.profile}
              otherProfile={queryData.order?.seller}
              isMeBuyer={isMeBuyer}
              onMessage={handleMessage}
            />
            {isMeBuyer ? (
              <>
                <SellerDiscountInfo
                  profile={queryData.viewer.profile}
                  deal={queryData.order.deal}
                />
                <SellerShippingInfo
                  profile={queryData.viewer.profile}
                  deal={queryData.order.deal}
                />
              </>
            ) : null}
            <OrderDetail
              isCheckout={true}
              isMeBuyer={isMeBuyer}
              order={queryData.order}
              onSelectCard={handleSelectCard}
              onAddShippingAddress={handleAddShippingAddress}
            />
            <ShipTo
              isEditable={true}
              address={queryData.order?.shippingAddress}
              onAddShippingAddress={handleAddShippingAddress}
              onChangeShippingAddress={handleChangeShippingAddress}
            />
            {queryData.order?.shippingAddress && totalPrice > 0 ? (
              <PaymentMethod
                isEditable={true}
                paymentMethod={currentPaymentMethod}
                onAddPaymentMethod={handleAddPaymentMethod}
                onChangePaymentMethod={handleChangePaymentMethod}
              />
            ) : null}
          </ScrollView>
          <CheckoutFooterActions
            order={queryData.order}
            paymentMethod={currentPaymentMethod}
            tabBarHeight={tabBarHeight}
            onSubmitOrder={handleCheckSubmitOrder}
          />
          <ActionSheet
            ref={actionSheetRef}
            tintColor={colors.primary}
            options={['Cancel Checkout', 'Cancel']}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={handleSelectAction}
          />
        </View>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

export default withCheckout(CheckoutContent);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    paddingVertical: 12,
  },
  iconMoreAction: {
    width: 28,
    height: 28,
  },
}));
