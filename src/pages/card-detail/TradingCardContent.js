import React, {useState, useEffect, useRef, Suspense} from 'react';
import {View, Text, Alert} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  Button,
  KeyboardAvoidingCommentView,
  LoadingIndicator,
  AIFloatingButton,
  FloatingButtonSize,
  Comments,
  CardMainInfo,
  PriceAndGrade,
  TradingCardConditionAndFlags,
  MarketplaceIntroduceSheet,
  TradingCardListingSheet,
} from 'components';

import NavBarRightForTradingCard from './components/NavBarRightForTradingCard';
import CardSoldInfo from './components/CardSoldInfo';
import CardView from './components/CardView';
import CardOwnerView from './components/CardOwnerView';
import SoldTradingCardSheet from './components/SoldTradingCardSheet';
import CardReportInfo from './components/CardReportInfo';
import ExtraContent from './ExtraContent';

import {useActions} from 'actions';
import {Constants, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {getStorageItem, setStorageItem, showErrorAlert} from 'utils';
import {withCardDetail} from 'store/containers';
import {getMessageChannel} from 'services';

const TradingCardContent = ({
  navigation,
  tradingCardId,
  scrollToComment,
  queryOptions,
  setEmailVerifiedAction,
}) => {
  const styles = useStyle();

  const actions = useActions();

  const [isVisibleComment, setIsVisibleComment] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isAddingTradingCard, setIsAddingTradingCard] = useState(false);
  const [isBuyingTradingCard, setIsBuyingTradingCard] = useState(false);
  const [isUpdatingTradingCard, setIsUpdatingTradingCard] = useState(false);
  const [isVisibleAIChatButton, setIsVisibleAIChatButton] = useState(true);

  const commentParentIdRef = useRef(null);
  const scrollCommentViewRef = useRef(null);
  const scrollCommentLayoutY = useRef(0);

  const isShowDealOnboarding = useRef(false);

  const [isVisibleMarketplaceIntroduce, setIsVisibleMarketplaceIntroduce] = useState(false);
  const [isVisibleSellCard, setIsVisibleSellCard] = useState(false);
  const [isVisibleMarkAsSold, setIsVisibleMarkAsSold] = useState(false);

  const [markAsSoldStep, setMarkAsSoldStep] = useState(0);

  const queryData = useLazyLoadQuery(graphql`
    query TradingCardContentQuery($tradingCardId: ID!) {
      tradingCard(with: {id: $tradingCardId}) {
        id
        frontImageUrl
        backImageUrl(usePlaceholderWhenAbsent: false)
        notes
        card {
          id
          name
          number
          set {
            name
          }
          frontImageUrl
          backImageUrl(usePlaceholderWhenAbsent: false)
          ...CardMainInfo_card
        }
        state
        viewer {
          isMine
          canAddToDeal
          canBuyItNow
        }
        owner {
          id
          isAnonymous
          status
          flags
          orderShipmentDetails {
            hasShippingAddress
          }
        }
        activeDeal {
          id
        }
        ...CardSoldInfo_tradingCard
        ...PriceAndGrade_tradingCard
        ...Comments_tradingCard
        ...CardOwnerView_tradingCard
        ...NavBarRightForTradingCard_tradingCard
        ...TradingCardListingSheet_tradingCard
        ...SoldTradingCardSheet_tradingCard
        ...TradingCardConditionAndFlags_tradingCard
        ...CardReportInfo_tradingCard
      }
      viewer {
        configuration {
          hasSellerSettings
        }
        profile {
          id
          isAnonymous
          type
          flags
        }
        ...CardOwnerView_viewer
        ...Comments_viewer
      }
    }`,
    {tradingCardId},
    queryOptions
  );

  if (!queryData) {
    return null;
  }

  const {tradingCard} = queryData;

  if (!tradingCard) {
    return null;
  }

  const {marketplace: buyerMarketplace} = queryData.viewer?.profile?.flags || {};
  const {marketplace: sellerMarketplace} = tradingCard.owner?.flags || {};
  const {hasSellerSettings} = queryData.viewer?.configuration || {};
  const {hasShippingAddress} = tradingCard.owner?.orderShipmentDetails || {};
  const {status} = tradingCard.owner || {};

  useEffect(() => {
    getStorageItem(Constants.showedDealOnboarding).then(result => {
      isShowDealOnboarding.current = result === 'yes';
    });
  }, []);

  useEffect(() => {
    setNavigationBar();
  }, [tradingCard]);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerRight: () =>
        <Suspense fallback={<View />}>
          <NavBarRightForTradingCard
            tradingCard={tradingCard}
            actions={actions}
          />
        </Suspense>
    });
  };

  const addTradingCardToDeal = () => {
    setIsAddingTradingCard(true);

    actions.addTradingCardsToDeal(
      tradingCard.owner.id,
      [tradingCard.id],
      {
        onComplete: (deal) => {
          setIsAddingTradingCard(false);
          actions.navigateDeal(deal?.id);
        },
        onError: (error) => {
          setIsAddingTradingCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const addToDealOrViewDeal = () => {
    if (tradingCard.activeDeal?.id) {
      actions.navigateDeal(tradingCard.activeDeal.id);
    } else {
      addTradingCardToDeal();
    }
  };

  const navigateMessage = () => {
    actions.navigateMessage({
      currentProfileId: queryData.viewer?.profile?.id,
      peerProfileId: tradingCard.owner?.id,
    });
  };

  const handleContactSeller = () => {
    setEmailVerifiedAction(navigateMessage);
  };

  const buyTradingCard = () => {
    if (status === Constants.userStatus.inactive) {
      Alert.alert(
        'Seller is inactive',
        'The seller has been inactive for more than 100 days. Please ensure that you get in contact with them before making a purchase.',
        [
          {
            text: 'Contact Seller',
            onPress: handleContactSeller,
          },
          {
            text: 'Go Back',
          },
        ],
      );
      return;
    } else if (buyerMarketplace && sellerMarketplace && !hasShippingAddress) {
      Alert.alert(
        'Seller needs to add address',
        'Please contact seller to add their shipping address before you can complete checkout.',
        [
          {
            text: 'Contact Seller',
            onPress: handleContactSeller,
          },
          {
            text: 'Cancel',
          },
        ],
      );
      return;
    }

    setIsBuyingTradingCard(true);

    actions.buyItNow(
      {
        tradingCard: {
          id: tradingCard.id,
        },
      },
      {
        onComplete: (deal) => {
          setIsBuyingTradingCard(false);

          if (deal.order?.id) {
            actions.navigateCheckout({
              orderId: deal.order.id,
              ordersWithUserAs: SchemaTypes.ordersWithMeAs.BUYER,
            });
            return;
          }

          setEmailVerifiedAction(navigateMessage);
        },
        onError: (error) => {
          setIsBuyingTradingCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const displayDealOnboarding = (isDeal) => {
    setStorageItem(Constants.showedDealOnboarding, 'yes');
    isShowDealOnboarding.current = true;

    navigation.navigate('OnboardingModal', {
      screen: 'DealOnboarding',
      params: {
        onComplete: isDeal ? addToDealOrViewDeal : buyTradingCard,
      },
    });
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleLayoutComments = ({nativeEvent: {layout}}) => {
    scrollCommentLayoutY.current = layout.y;

    if (scrollToComment) {
      handleGoComment();
    }
  };

  const handleGoComment = () => {
    if (scrollCommentViewRef.current) {
      scrollCommentViewRef.current.scrollTo({
        x: 0,
        y: scrollCommentLayoutY.current,
        animated: true,
      });
    }
  };

  const handleLeaveComment = (parentId) => {
    if (queryData.viewer?.profile?.isAnonymous) {
      actions.navigateCreateAccount();
      return;
    }

    commentParentIdRef.current = parentId;
    setIsVisibleComment(!isVisibleComment);
  };

  const handleSendComment = (comment) => {
    setIsAddingComment(true);

    const values = {};

    if (commentParentIdRef.current) {
      values.commentId = commentParentIdRef.current;
    } else {
      values.tradingCardId = tradingCardId;
    }

    actions.createComment(
      comment,
      values,
      {
        onComplete: () => {
          setIsAddingComment(false);
        },
        onError: (error) => {
          setIsAddingComment(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );

    commentParentIdRef.current = null;
  };

  const handleWillShowKeyboard = () => {
    setIsVisibleAIChatButton(false);
  };

  const handleWillHideKeyboard = () => {
    setIsVisibleAIChatButton(true);
  };

  const handleAddToDeal = () => {
    const addToDeal = () => {
      if (!isShowDealOnboarding.current) {
        displayDealOnboarding(true);
        return;
      }

      addToDealOrViewDeal();
    };

    setEmailVerifiedAction(addToDeal);
  };

  const handleBuyNow = () => {
    const buyNow = () => {
      if (!isShowDealOnboarding.current) {
        displayDealOnboarding();
      }

      buyTradingCard();
    };

    setEmailVerifiedAction(buyNow);
  };

  const handleCloseTradingCardListingPrice = () => {
    setIsVisibleSellCard(false);
  };

  const handleUpdateTradingCardListingPrice = (tradingCardId, askingPrice) => {

    handleCloseTradingCardListingPrice();

    setIsUpdatingTradingCard(true);

    actions.updateTradingCardListingPrice(
      tradingCardId,
      askingPrice,
      {
        onComplete: () => {
          setIsUpdatingTradingCard(false);
        },
        onError: (error) => {
          setIsUpdatingTradingCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  const handleCloseMarkAsSold = () => {
    setIsVisibleMarkAsSold(false);
  };

  const handleMarkTradingCardAsSold = (tradingCardId, salePrice, type) => {
    if (!tradingCardId || !type) {
      return;
    }

    handleCloseMarkAsSold();

    setIsUpdatingTradingCard(true);

    actions.soldTradingCard(
      tradingCardId,
      salePrice,
      type,
      {
        onComplete: () => {
          setIsUpdatingTradingCard(false);
        },
        onError: (error) => {
          setIsUpdatingTradingCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  const handleRemoveAskingPrice = () => {
    setIsUpdatingTradingCard(true);

    actions.removeTradingCardAskingPrice(
      tradingCard.id,
      {
        onComplete: () => {
          setIsUpdatingTradingCard(false);
        },
        onError: (error) => {
          setIsUpdatingTradingCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  const handleCanonicalCardDetail = () => {
    actions.pushCanonicalCardDetail(tradingCard.card.id, tradingCard.id);
  };

  const handleOpenAIChat = async () => {
    const {type: profileType} = queryData.viewer?.profile || {};
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser) {
      actions.navigateCollXProModal({
        source: Constants.collXProUpgradeSource.tradingCard,
      });
      return;
    }

    setEmailVerifiedAction(() => {
      actions.navigateChatBotMessage({
        profileId: queryData.viewer?.profile?.id,
        canonicalCard: tradingCard.card,
      });
    });
  };

  const handleSendUserCard = (currentProfileId, peerProfileId, tradingCarId) => {
    setEmailVerifiedAction(() => {
      getMessageChannel(currentProfileId, peerProfileId, tradingCarId)
        .then(messageInfo => actions.navigateMessageChannel(messageInfo))
        .catch(error => showErrorAlert(error))
    });
  };

  const handleSellCard = () => {
    if (queryData.viewer.profile?.isAnonymous) {
      actions.navigateCreateAccount();
      return;
    }

    if (!buyerMarketplace || hasSellerSettings) {
      setIsVisibleSellCard(true);
    } else {
      setIsVisibleMarketplaceIntroduce(true);
    }
  };

  const handleCloseMarketplaceSettings = () => {
    setIsVisibleMarketplaceIntroduce(false);
  };

  const handleSetSellerSettings = () => {
    handleSkipMarketplaceSettings();

    actions.navigateSetSellerSettings();
  };

  const handleSkipMarketplaceSettings = () => {
    handleCloseMarketplaceSettings();

    setIsVisibleSellCard(true);
  };

  const handleMarkAsSold = () => {
    setIsVisibleMarkAsSold(true);
  };

  const renderDealActions = () => {
    if (tradingCard.viewer.isMine || tradingCard.owner.isAnonymous) {
      return null;
    }

    const canAddToDeal = tradingCard.viewer.canAddToDeal;
    const canBuyItNow = tradingCard.viewer.canBuyItNow;

    const inactiveBuyNow = (buyerMarketplace && sellerMarketplace && !hasShippingAddress) || (status === Constants.userStatus.inactive);
    const isActiveDeal = tradingCard.activeDeal || canAddToDeal;

    return (
      <View style={styles.rowActionsContainer}>
        {isActiveDeal ? (
          <Button
            style={styles.generalButton}
            label={tradingCard.activeDeal ? "View in Deal" : "Add to Deal"}
            labelStyle={[styles.textGeneralButton, styles.textSellCard]}
            scale={Button.scaleSize.One}
            onPress={handleAddToDeal}
          />
        ) : null}
        {canBuyItNow ? (
          <Button
            style={[
              styles.generalButton,
              isActiveDeal && styles.rightButton,
              inactiveBuyNow && styles.inactiveButton,
            ]}
            label="Buy Now"
            labelStyle={[styles.textGeneralButton, styles.textSellCard]}
            scale={Button.scaleSize.One}
            onPress={handleBuyNow}
          />
        ) : null}
      </View>
    );
  };

  const renderActions = () => {
    if (!tradingCard.card || !tradingCard.viewer.isMine) {
      return null;
    }

    if (tradingCard.state === SchemaTypes.tradingCardState.LISTED) {
      return (
        <>
          <Button
            style={styles.generalButton}
            label="Mark As Sold"
            labelStyle={[styles.textGeneralButton, styles.textSellCard]}
            scale={Button.scaleSize.One}
            onPress={handleMarkAsSold}
          />
          <Button
            style={[styles.generalBorderButton, styles.removeButton]}
            label="Remove Asking Price"
            labelStyle={[styles.textGeneralButton, styles.textRemove]}
            scale={Button.scaleSize.One}
            onPress={handleRemoveAskingPrice}
          />
        </>
      );
    } else if (tradingCard.state !== SchemaTypes.tradingCardState.SOLD) {
      return (
        <View style={styles.rowActionsContainer}>
          <Button
            style={styles.generalButton}
            label="Sell Card"
            labelStyle={[styles.textGeneralButton, styles.textSellCard]}
            scale={Button.scaleSize.One}
            onPress={handleSellCard}
          />
          <Button
            style={[styles.generalButton, styles.rightButton]}
            label="Mark As Sold"
            labelStyle={[styles.textGeneralButton, styles.textSellCard]}
            scale={Button.scaleSize.One}
            onPress={handleMarkAsSold}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isAddingComment || isAddingTradingCard || isBuyingTradingCard || isUpdatingTradingCard} />
      <KeyboardAvoidingCommentView
        ref={scrollCommentViewRef}
        contentContainerStyle={[
          styles.contentContainer,
          isVisibleAIChatButton && {paddingBottom: FloatingButtonSize + 16},
        ]}
        visibleComment={isVisibleComment}
        onHideComment={setIsVisibleComment}
        onSendComment={handleSendComment}
        onWillShowKeyboard={handleWillShowKeyboard}
        onWillHideKeyboard={handleWillHideKeyboard}
        onRefresh={handleRefresh}>
        <CardOwnerView
          viewer={queryData.viewer}
          tradingCard={tradingCard}
          onComment={handleGoComment}
          onSendUserCard={handleSendUserCard}
        />
        {tradingCard.card ? (
          <CardMainInfo card={tradingCard.card} />
        ) : null}
        <TradingCardConditionAndFlags
          style={styles.cardTagsContainer}
          tradingCard={tradingCard}
        />
        <CardReportInfo tradingCard={tradingCard} />
        <CardView
          warnAboutNonUGC={!tradingCard.frontImageUrl}
          frontImageUrl={tradingCard.frontImageUrl || Constants.defaultCardImage}
          backImageUrl={tradingCard.backImageUrl}
        />
        <CardSoldInfo tradingCard={tradingCard} />
        <View style={styles.actionsContainer}>
          {renderDealActions()}
          {renderActions()}
        </View>
        {tradingCard.notes ? (
          <View style={styles.noteContainer}>
            <Text style={styles.textNoteTitle}>Notes</Text>
            <Text style={styles.textNote}>{tradingCard.notes}</Text>
          </View>
        ) : null}
        <PriceAndGrade
          style={styles.tradingCardPriceAndGrade}
          tradingCard={tradingCard}
        />
        {tradingCard.card ? (
          <>
            {tradingCard.viewer.isMine ? (
              <ExtraContent
                canonicalCardId={tradingCard.card.id}
                tradingCardIdForIssue={tradingCardId}
                queryOptions={queryOptions}
              />
            ) : null}
            {/* <Text style={styles.textDescription}>
              Displaying Price for Very Good Condition
            </Text> */}
            <Button
              style={[styles.generalBorderButton, styles.viewCardButton]}
              label="View More Prices, Sales, Listings"
              labelStyle={[styles.textGeneralButton, styles.textViewCard]}
              scale={Button.scaleSize.One}
              onPress={handleCanonicalCardDetail}
            />
          </>
        ) : null}
        <Comments
          viewer={queryData.viewer}
          tradingCard={tradingCard}
          onLayout={handleLayoutComments}
          onLeaveComment={handleLeaveComment}
        />
      </KeyboardAvoidingCommentView>
      {isVisibleAIChatButton ? (
        <AIFloatingButton
          onPress={handleOpenAIChat}
        />
      ) : null}
      <TradingCardListingSheet
        isVisible={isVisibleSellCard}
        tradingCard={tradingCard}
        onUpdateListingPrice={handleUpdateTradingCardListingPrice}
        onClose={handleCloseTradingCardListingPrice}
      />
      <SoldTradingCardSheet
        isVisible={isVisibleMarkAsSold}
        markAsSoldStep={markAsSoldStep}
        tradingCard={tradingCard}
        onMarkAsSold={handleMarkTradingCardAsSold}
        onChangedStep={(step) => setMarkAsSoldStep(step)}
        onClose={handleCloseMarkAsSold}
      />
      <MarketplaceIntroduceSheet
        isVisible={isVisibleMarketplaceIntroduce}
        onSetSellerSettings={handleSetSellerSettings}
        onSkip={handleSkipMarketplaceSettings}
        onClose={handleCloseMarketplaceSettings}
      />
    </View>
  );
};

export default withCardDetail(TradingCardContent);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    paddingBottom: 8,
  },
  actionsContainer: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  rowActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGeneralButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  generalButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 8,
  },
  inactiveButton: {
    backgroundColor: Colors.primaryAlpha5,
  },
  textSellCard: {
    color: Colors.white,
  },
  textRemove: {
    color: Colors.red,
  },
  generalBorderButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  viewCardButton: {
    borderColor: colors.primary,
    marginHorizontal: 16,
  },
  removeButton: {
    borderColor: Colors.red,
  },
  textViewCard: {
    color: colors.primary,
  },
  noteContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  textNoteTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.41,
    color: colors.primaryText,
    marginBottom: 8,
  },
  textNote: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  tradingCardPriceAndGrade: {
    marginBottom: 12,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.grayText,
    marginBottom: 24,
    textAlign: 'center',
  },
  cardTagsContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  rightButton: {
    marginLeft: 10,
  },
}));