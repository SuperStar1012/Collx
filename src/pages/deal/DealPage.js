import React, {useEffect, useCallback, useState, useRef, Suspense, useMemo} from 'react';
import {View, ScrollView, RefreshControl, Alert} from 'react-native';
import {graphql, useLazyLoadQuery, useSubscription} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';

import {
  NavBarButton,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  DueAtCountdown,
} from 'components';
import DealDetail from './components/DealDetail';
import DealPrices from './components/DealPrices';
import DealFooter from './components/DealFooter';
import NoResult from './components/NoResult';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {SchemaTypes} from 'globals';
import {createUseStyle, useTheme} from 'theme';
import {showErrorAlert} from 'utils';
import {withDeal} from 'store/containers';

const ellipsisIcon = require('assets/icons/ellipsis.png');

const DealPage = props => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions(prev => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
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

const endReachedThreshold = 0.2;

const Content = ({
  navigation,
  route,
  queryOptions,
  setEmailVerifiedAction,
}) => {
  const {dealId} = route.params || {};

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const actions = useActions();

  const actionSheetRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const tradingCardsListRef = useRef(null);
  const scrollViewContentHeightRef = useRef(0);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = Math.round(
      contentSize.height * endReachedThreshold,
    );

    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (isBottom && scrollViewContentHeightRef.current !== contentSize.height) {
      scrollViewContentHeightRef.current = contentSize.height;
      return true;
    }

    return false;
  };

  const subscriptionConfig = useMemo(() => ({
    variables: {dealId},
    subscription: graphql`
      subscription DealPageSubscription($dealId: ID!) {
        dealChanged(id: $dealId) {
          id
          state
          cancelledBy
          nextAction
          nextActionDueAt
          seller {
            id
            status
            flags
            orderShipmentDetails {
              hasShippingAddress
            }
          }
          buyer {
            id
          }
          offer {
            madeBy
            value {
              formattedAmount
            }
          }
          order {
            id
            state
            nextAction
            nextActionDueAt
          }
          tradingCards {
            id
            state
            sale {
              soldFor {
                amount
                formattedAmount
              }
            }
            listing {
              askingPrice {
                amount
                formattedAmount
              }
            }
            marketValue {
              source
              price {
                amount
                formattedAmount
              }
            }
          }
          chargeBreakdown {
            type
            value {
              amount
              formattedAmount
            }
          }
          viewer {
            canMakeOffer
          }
        }
      }`
    ,
    onError: (error) => {
      console.log(error);
    },
  }), [dealId]);

  useSubscription(subscriptionConfig);

  const queryData = useLazyLoadQuery(
    graphql`
      query DealPageQuery($dealId: ID!) {
        deal(with: {id: $dealId}) {
          state
          order {
            id
            ...DueAtCountdown_order
          }
          buyer {
            id
          }
          seller {
            id
          }
          tradingCards {
            id
          }
          ...DealDetail_deal
          ...DealPrices_deal
          ...DealFooter_deal
          ...DueAtCountdown_deal
        }
        viewer {
          profile {
            id
          }
          ...DealDetail_viewer
          ...DealFooter_viewer
        }
      }
    `,
    {
      dealId,
    },
    queryOptions,
  );

  const {
    seller,
    buyer,
    state,
    order,
    tradingCards,
  } = queryData.deal || {};

  const isMeBuyer = buyer?.id === queryData.viewer.profile.id;
  const tradingCardsCount = tradingCards?.length || 0;

  useEffect(() => {
    setNavigationBar();
  }, [state]);

  const setNavigationBar = () => {
    navigation.setOptions({
      title: 'Deal',
      headerRight: () => (
        state !== SchemaTypes.dealState.CANCELLED && state !== SchemaTypes.dealState.ACCEPTED && state !== SchemaTypes.dealState.COMPLETED ? (
          <NavBarButton
            icon={ellipsisIcon}
            iconStyle={styles.iconMoreAction}
            onPress={handleMoreAction}
          />
        ) : null
      ),
    });
  };

  const navigateMessage = () => {
    handleMessage({
      currentProfileId: isMeBuyer ? buyer?.id : seller?.id,
      peerProfileId: isMeBuyer ? seller?.id : buyer?.id,
      isRootScreen: true,
    });
  };

  const handleCheckMarketplace = () => {
    const navigateCheckout = () => {
      if (order?.id) {
        actions.navigateCheckout({
          orderId: order.id,
          ordersWithUserAs: SchemaTypes.ordersWithMeAs.BUYER,
        });
      }
    };

    setEmailVerifiedAction(navigateCheckout);
  };

  const handleViewOrderDetail = () => {
    if (order?.id) {
      actions.navigateOrderDetail({
        orderId: order.id,
        isFromCheckout: false,
      });
    }
  };

  const handleMoreAction = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  if (!queryData.deal || !tradingCardsCount) {
    return <NoResult />;
  }

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleAskCancelDeal = () => {
    // Cancel Deal
    Alert.alert(
      'Are you sure you want to cancel this deal?',
      isMeBuyer ?
        'No problem. You can always start a fresh deal with the seller again.'
      :
        'No problem. If you changed your mind, you can still contact the buyer and make a counteroffer.',
      [
        {
          text: 'Yes',
          onPress: handleCancelDeal,
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const handleSelectAction = async index => {
    switch (index) {
      case 0: {
        // Cancel Deal
        handleAskCancelDeal();
        break;
      }
    }
  };

  const handleCancelDeal = () => {
    const cancelParams = {};

    if (isMeBuyer) {
      cancelParams.sellerId = seller.id;
    } else {
      cancelParams.buyerId = buyer.id;
    }

    setIsUpdating(true);

    actions.cancelDeal(
      cancelParams,
      {
        onComplete: () => {
          setIsUpdating(false);

          handleMessage(
            isMeBuyer ? buyer.id : seller.id,
            isMeBuyer ? seller.id : buyer.id,
          );
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleSaveForLater = (tradingCardIds, removeFromDeal, dealId) => {
    setIsUpdating(true);

    actions.addTradingCardsToSavedForLater({
      tradingCardIds,
      removeFromDeal,
      dealId,
    }, {
      onComplete: () => {
        setIsUpdating(false);
      },
      onError: (error) => {
        console.log(error);
        setIsUpdating(false);

        if (error?.message) {
          showErrorAlert(error?.message);
        }
      },
    });
  };

  const handleRemoveCard = (sellerId, tradingCardIds) => {
    if (tradingCardsCount < 2) {
      handleAskCancelDeal();
      return;
    }

    setIsUpdating(true);

    actions.removeTradingCardsFromDeal(
      sellerId,
      tradingCardIds,
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
        },
      },
    );
  };

  const handleAddCard = (sellerId, tradingCardIds) => {
    setIsUpdating(true);

    actions.addTradingCardsToDeal(
      sellerId,
      tradingCardIds,
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
        },
      },
    );
  };

  const handleBuyItNow = (sellerId) => {
    const buyItNow = () => {
      setIsUpdating(true);

      actions.buyItNow(
        {
          activeDeal: {
            sellerId,
          },
        },
        {
          onComplete: (deal) => {
            setIsUpdating(false);

            if (deal.order?.id) {
              actions.navigateCheckout({
                orderId: deal.order.id,
                ordersWithUserAs: SchemaTypes.ordersWithMeAs.BUYER,
              });
              return;
            }

            navigateMessage();
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

    setEmailVerifiedAction(buyItNow);
  };

  const handleAcceptOffer = (params) => {
    setIsUpdating(true);

    actions.acceptOffer(
      params,
      {
        onComplete: (deal) => {
          setIsUpdating(false);

          if (deal.order?.id) {
            return;
          }

          navigateMessage();
        },
        onError: (error) => {
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    )
  };

  const handleRejectOffer = (params) => {
    setIsUpdating(true);

    actions.rejectOffer(
      params,
      {
        onComplete: () => {
          setIsUpdating(false);

          navigateMessage();
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

  const handleMessage = (currentProfileId, peerProfileId, isRootScreen) => {
    setEmailVerifiedAction(() => {
      actions.navigateMessage({
        currentProfileId,
        peerProfileId,
        isRootScreen,
      });
    });
  };

  const handleRenewDeal = () => {
    setIsUpdating(true);

    actions.renewDeal(
      dealId,
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

  const handleEndReached = () => {
    if (!tradingCardsListRef.current) {
      return;
    }

    tradingCardsListRef.current.loadNextTradingCards();
  };

  const handleScroll = ({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {
      handleEndReached();
    }
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdating} />
      <DueAtCountdown
        isMeBuyer={isMeBuyer}
        deal={queryData.deal}
        order={queryData.deal?.order}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={colors.primary}
            onRefresh={handleRefresh}
          />
        }
        scrollEventThrottle={5}
        onScroll={handleScroll}
      >
        <DealDetail
          ref={tradingCardsListRef}
          viewer={queryData.viewer}
          deal={queryData.deal}
          onAddCard={handleAddCard}
          onRemoveCard={handleRemoveCard}
          onSaveForLater={handleSaveForLater}
          onMessage={handleMessage}
        />
        <DealPrices
          deal={queryData.deal}
          isMeBuyer={isMeBuyer}
        />
      </ScrollView>
      <DealFooter
        viewer={queryData.viewer}
        deal={queryData.deal}
        onCheckout={handleCheckMarketplace}
        onViewOrderDetail={handleViewOrderDetail}
        onBuyItNow={handleBuyItNow}
        onAcceptOffer={handleAcceptOffer}
        onRejectOffer={handleRejectOffer}
        onMessage={handleMessage}
        onRenewDeal={handleRenewDeal}
        />
      <ActionSheet
        ref={actionSheetRef}
        tintColor={colors.primary}
        options={['Cancel Deal', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={handleSelectAction}
      />
    </View>
  );
};

export default withDeal(DealPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  iconMoreAction: {
    width: 28,
    height: 28,
  },
}));
