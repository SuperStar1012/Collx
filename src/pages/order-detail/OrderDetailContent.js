import React, {useEffect, useState, useMemo} from 'react';
import {View, ScrollView, RefreshControl, BackHandler} from 'react-native';
import {graphql, useLazyLoadQuery, useSubscription} from 'react-relay';
import {StackActions, useIsFocused} from '@react-navigation/native';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  LoadingIndicator,
  NavBarButton,
  DealUser,
  OrderDetail,
  PaymentMethod,
  ShipTo,
  DueAtCountdown,
  DueAtCountdownPosition,
} from 'components';
import OrderIn from './components/OrderIn';
import OrderPrimaryInfo from './components/OrderPrimaryInfo';
import ShipmentStatus from './components/ShipmentStatus';
import RatingUser from './components/RatingUser';
import OrderDescription from './components/OrderDescription';
import OrderFooterActions from './components/OrderFooterActions';

import {useActions} from 'actions';
import {Constants, SchemaTypes} from 'globals';
import {createUseStyle, useTheme} from 'theme';
import {showErrorAlert} from 'utils';

const closeIcon = require('assets/icons/close.png');

const OrderDetailContent = ({
  navigation,
  route,
  queryOptions,
  isFetchingPaymentMethod,
  paymentMethods,
  otherPaymentMethods,
  getPaymentMethod,
  setSort,
  setFilter,
  updateUserCardsCount,
  setEmailVerifiedAction,
}) => {
  const {
    orderId,
    isFromCheckout,
  } = route.params || {};

  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const actions = useActions();

  const subscriptionConfig = useMemo(() => ({
    variables: {orderId},
    subscription: graphql`
      subscription OrderDetailContentSubscription($orderId: ID!) {
        orderChanged(id: $orderId) {
          state
          stateGroup
          nextAction
          nextActionDueAt
          shipmentDetails {
            trackingNumber
            trackingUrl
            postageLabelUrl
          }
          timeline(first: 20) {
            edges {
              node {
                id
                createdAt
                toState
              }
            }
          }
          viewer {
            canCardsBeMovedToCollection
            canCardsBeRemovedFromSellersCollection
            canChangeTrackingNumber
            canICheckout
            canIRequestRefund
            packingListUrl
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
      query OrderDetailContentQuery($id: ID!) {
        order(with: {id: $id}) {
          id
          nextAction
          nextActionDueAt
          seller {
            id
            ...DealUser_other_profile
          }
          buyer {
            id
            ...DealUser_other_profile
          }
          deal {
            tradingCards {
              id
            }
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
            }
          }
          ...OrderDetail_order
          ...OrderPrimaryInfo_order
          ...RatingUser_order
          ...OrderDescription_order
          ...OrderFooterActions_order
          ...OrderStatusTracking_order
          ...OrderStatusSummary_order
          ...ShipmentStatus_order
          ...DueAtCountdown_order
        }
        viewer {
          profile {
            id
            ...DealUser_my_profile
          }
        }
      }
    `,
    {
      id: orderId
    },
    queryOptions,
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [isVisibleOrderIn, setIsVisibleOrderIn] = useState(isFromCheckout);

  const isMeBuyer = useMemo(() => queryData.order.buyer?.id === queryData.viewer.profile.id, []);

  const totalPrice = useMemo(() => {
    const total = queryData.order.chargeBreakdown?.find(item => item.type === SchemaTypes.orderChargeBreakdownItemType.DUE_AT_CHECKOUT);
    return total?.value?.amount || 0;
  }, [queryData.order.chargeBreakdown]);

  useEffect(() => {
    setNavigationBar();

    let backHandler = null;
    if (isFromCheckout) {
      backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleClose,
      );
    }

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [isFromCheckout, isFocused]);

  useEffect(() => {
    const paymentMethodId = queryData.order?.paymentDetails?.stripePaymentMethod;

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
  }, [queryData.order?.paymentDetails?.stripePaymentMethod, paymentMethods, otherPaymentMethods])

  const setNavigationBar = () => {
    const options = {};
    if (isFromCheckout) {
      options.headerLeft = () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      );
    }

    navigation.setOptions(options);
  };

  const navigateMyCollection = () => {
    const profileId = queryData.viewer?.profile?.id;

    setSort({profileId, sort_by: null});
    setFilter({profileId, filter_by: {}});
    updateUserCardsCount();

    navigation.navigate('CollectionBottomTab');
  };

  const handleClose = () => {
    if (!isFocused) {
      return false;
    }

    navigation.goBack();
    navigation.dispatch(StackActions.popToTop());
    return true;
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleCloseOrderIn = () => {
    setIsVisibleOrderIn(false);
  };

  const handleSelectCard = (tradingCardId) => {
    actions.pushTradingCardDetail(tradingCardId);
  };

  const handleEditTrackingCode = (trackingCode) => {
    if (queryData?.order?.id) {
      actions.navigateAddTrackingCode({
        orderId: queryData.order.id,
        trackingCode,
      });
    }
  };

  const handleChangeRating = (rating) => {
    if (!queryData?.order?.id || !rating) {
      return;
    }

    setIsUpdating(true);

    actions.setRatingOrder(
      queryData.order.id,
      rating,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleMarkAsReceived = () => {
    if (!queryData?.order?.id) {
      return;
    }

    setIsUpdating(true);

    actions.markOrderAsCompleted(
      queryData.order.id,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleAddAllToCollection = () => {
    if (!queryData?.order?.id) {
      return;
    }

    setIsUpdating(true);

    actions.addCardsFromOrderToCollection(
      queryData.order.id,
      {
        onComplete: () => {
          setIsUpdating(false);

          navigateMyCollection();
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleMarkAsShipped = () => {
    if (!queryData?.order?.id) {
      return;
    }

    setIsUpdating(true);

    actions.markOrderAsShipped(
      queryData.order.id,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
  };

  const handleDeleteAllFromCollection = () => {
    if (!queryData.order?.id) {
      return;
    }

    setIsUpdating(true);
    actions.removeCardsFromSellersCollection(
      queryData.order.id,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleMarkAsReturned = () => {
    if (!queryData?.order?.id) {
      return;
    }

    setIsUpdating(true);

    actions.markReturnAsDelivered(
      queryData.order.id,
      {
        onComplete: () => {
          setIsUpdating(false);
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        }
      },
    );
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
          <LoadingIndicator isLoading={isUpdating || isFetchingPaymentMethod} />
          <OrderIn
            isVisible={isVisibleOrderIn}
            onClose={handleCloseOrderIn}
          />
          <ScrollView
            contentContainerStyle={[styles.contentContainer, !tabBarHeight && {paddingBottom: insets.bottom || 16}]}
            scrollIndicatorInsets={{right: 1}}
            refreshControl={
              <RefreshControl
                refreshing={false}
                tintColor={colors.primary}
                onRefresh={handleRefresh}
              />
            }
          >
            <OrderPrimaryInfo order={queryData.order} />
            <DealUser
              myProfile={queryData.viewer.profile}
              otherProfile={isMeBuyer ? queryData.order?.seller : queryData.order?.buyer}
              isMeBuyer={isMeBuyer}
              onMessage={handleMessage}
            />
            <OrderDetail
              isCheckout={false}
              isMeBuyer={isMeBuyer}
              order={queryData.order}
              // otherUserProfile={isMeBuyer ? queryData.order?.buyer : queryData.order?.seller}
              onSelectCard={handleSelectCard}
            />
            <ShipTo
              isEditable={false}
              address={queryData.order?.shippingAddress}
            />
            {isMeBuyer && currentPaymentMethod && totalPrice > 0 ? (
              <PaymentMethod
                isEditable={false}
                paymentMethod={currentPaymentMethod}
              />
            ) : null}
            <ShipmentStatus
              order={queryData.order}
              isMeBuyer={isMeBuyer}
              onEditTrackingCode={handleEditTrackingCode}
            />
            <RatingUser
              order={queryData.order}
              isMeBuyer={isMeBuyer}
              onChangeRating={handleChangeRating}
            />
            <OrderDescription
              order={queryData.order}
              isMeBuyer={isMeBuyer}
            />
            <DueAtCountdown
              isMeBuyer={isMeBuyer}
              position={DueAtCountdownPosition.bottom}
              deal={queryData.order?.deal}
              order={queryData.order}
            />
            <OrderFooterActions
              order={queryData.order}
              isMeBuyer={isMeBuyer}
              onMarkAsReceived={handleMarkAsReceived}
              onAddAllToCollection={handleAddAllToCollection}
              onMarkAsShipped={handleMarkAsShipped}
              onDeleteAllFromCollection={handleDeleteAllFromCollection}
              onMarkAsReturned={handleMarkAsReturned}
              onMessage={handleMessage}
            />
          </ScrollView>
        </View>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

export default OrderDetailContent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
}));
