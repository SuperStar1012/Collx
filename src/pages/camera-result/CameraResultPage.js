import React, {useEffect, useRef, useState, useMemo, useCallback, Suspense} from 'react';
import {View, Text, FlatList, Platform, StatusBar} from 'react-native';
import LottieView from 'lottie-react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {graphql, useLazyLoadQuery} from 'react-relay';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import {
  Button,
  ProgressStep,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  UserCardEditSheet,
  ScanRemoveSheet,
  TradingCardListingSheet,
  MarketplaceIntroduceSheet,
} from 'components';
import CaptureItem from './components/CaptureItem'

import ActionContext, {
  useActions,
  createNavigationActions,
} from 'actions';
import {Constants, Styles} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {withCaptureResult} from 'store/containers';
import {getCount, encodeId, showErrorAlert} from 'utils';
import {analyticsNavigationRoute} from 'services';

const loadingIcon = require('assets/lottie/loading_white.json');

const CameraResultPage = props => {
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
    <BottomSheetModalProvider>
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
                onRefetch={handleRefresh}
              />
            </Suspense>
          </ErrorBoundaryWithRetry>
        </View>
      </ActionContext.Provider>
    </BottomSheetModalProvider>
  );
};

const Content = props => {
  const {
    navigation,
    route,
    isFetching,
    capturedCards,
    searchedCards,
    possibleMatchCards,
    queryOptions,
    onRefetch,
    setHandleSearchBack,
    setSearchModalMode,
    updatedCardIds,
    removeCapturedCard,
    confirmUserCard,
    updateCapturedCard,
    reuploadVisualSearch,
    recreateUserCard,
    reuploadUserCardMedia,
  } = props;

  const {cardType} = route.params;

  const {t: {colors}, selectedTheme} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const [isVisibleSellCard, setIsVisibleSellCard] = useState(false);
  const [isVisibleMarketplaceIntroduce, setIsVisibleMarketplaceIntroduce] = useState(false);
  const [isVisibleEditScan, setIsVisibleEditScan] = useState(false);
  const [isVisibleRemoveScan, setIsVisibleRemoveScan] = useState(false);

  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const addToCollectionRef = useRef(false);
  const [editingTradingCard, setEditingTradingCard] = useState(null);
  const [isUpdatingUserCard, setIsUpdatingUserCard] = useState(false);

  const uploadingCards = useMemo(() => (
    capturedCards.filter(card => !card.completed && (card.cardId === undefined || !card.frontImageId)) //  && card.frontImageUploadUrl
  ), [capturedCards]);

  const failedCards = useMemo(() => (
    capturedCards.filter(card => (
      card.cardState === Constants.cardSearchState.failedVisualSearch ||
      card.cardState === Constants.cardSearchState.failedCreate ||
      card.cardState === Constants.cardSearchState.failedMedia
    ))
  ), [capturedCards]);

  const isUploadingCards = (uploadingCards.length - failedCards.length) > 0;
  const createdCardsCount = capturedCards.length - failedCards.length;

  const queryData = useLazyLoadQuery(graphql`
    query CameraResultPageQuery {
      viewer {
        profile {
          type
          flags
          tradingCards(with: {states: [ACCEPTING_OFFERS, LISTED, NOT_FOR_SALE, SOLD, UNIDENTIFIED]}) {
            count
          }
        }
        configuration {
          hasSellerSettings
        }
      }
    }`,
    {},
    queryOptions
  );

  const {profile, configuration} = queryData.viewer || {};

  useEffect(() => {
    return () => {
      setSearchModalMode(Constants.searchModalMode.none);
    };
  }, []);

  useEffect(() => {
    const statusBarStyle = selectedTheme === Constants.colorSchemeName.dark ? 'light-content' : 'dark-content';
    StatusBar.setBarStyle(statusBarStyle);

    if (Platform.OS === 'android') {
      const statusBarBackgroundColor = selectedTheme === Constants.colorSchemeName.dark ? Colors.black : Colors.white;
      StatusBar.setBackgroundColor(statusBarBackgroundColor);
      changeNavigationBarColor(statusBarBackgroundColor);
    }

    return () => {
      if (selectedTheme === Constants.colorSchemeName.light) {
        const statusBarStyle = 'light-content';
        StatusBar.setBarStyle(statusBarStyle);

        if (Platform.OS === 'android') {
          const statusBarBackgroundColor = Colors.black;
          StatusBar.setBackgroundColor(statusBarBackgroundColor);
          changeNavigationBarColor(statusBarBackgroundColor);
        }
      }
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (addToCollectionRef.current === true) {
      addToCollectionRef.current = false;
      navigation.navigate('CollectionBottomTab');
    } else if (!capturedCards.length) {
      navigation.goBack();
    }
  }, [capturedCards]);

  const handleEditBottomSheet = () => {
    setIsVisibleRemoveScan(false);
    setIsVisibleEditScan(false);
  };

  const handleRefetch = () => {
    if (onRefetch) {
      onRefetch();
    }
  };

  const handleAddToCollection = () => {
    addToCollectionRef.current = true;

    actions.addEngagement(Constants.userEngagement.added);

    if (!capturedCards.length) {
      return;
    }

    const addedCards = [];
    capturedCards.map(card => {
      if (
        (card.tradingCardId || card.cardId !== undefined) &&
        card.cardState !== Constants.cardSearchState.failedVisualSearch &&
        card.cardState !== Constants.cardSearchState.failedCreate &&
        card.cardState !== Constants.cardSearchState.failedMedia
      ) {
        const cardIndex = addedCards.findIndex(item => (
          item.tradingCardId === card.tradingCardId ||
          (item.cardId && item.id === card.id)
        ));

        if (cardIndex === -1) {
          addedCards.push(card);
        }
      }
    });

    const tradingCardIds = [];
    addedCards.map(currentCard => {
      const tradingCardId = currentCard.tradingCardId || (currentCard.cardId && encodeId(Constants.base64Prefix.tradingCard, currentCard.id));
      tradingCardIds.push(tradingCardId);
    });

    if (!tradingCardIds.length) {
      return;
    }

    const {type: profileType, tradingCards} = profile || {};
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser && ((tradingCards.count || 0) + tradingCardIds.length) > Constants.userCardsLimitInCollection) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.ScanResults,
      });

      return;
    }

    setIsUpdatingUserCard(true);

    actions.clearPendingFlagForTradingCards(
      tradingCardIds,
      {
        onComplete: () => {
          setIsUpdatingUserCard(false);

          confirmUserCard({
            cards: addedCards,
          });
        },
        onError: (error) => {
          setIsUpdatingUserCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  const handleSelectCard = (item) => {
    if (!item) {
      return;
    }

    if (
      item.cardState !== Constants.cardSearchState.created &&
      item.cardState !== Constants.cardSearchState.updated
    ) {
      return;
    }

    navigation.navigate('CameraDrawerStackModal', {
      screen: 'CameraDrawer',
      params: {
        userCard: item,
      },
    });
  };

  const handleMoreActions = (item, index) => {
    setCurrentCardIndex(index);

    if (
      item.cardState === Constants.cardSearchState.searching ||
      item.cardState === Constants.cardSearchState.detected ||
      item.cardState === Constants.cardSearchState.retryingCreate ||
      item.cardState === Constants.cardSearchState.retryingUploadMedia
    ) {
      setIsVisibleRemoveScan(true);
    } else if (
      item.cardState === Constants.cardSearchState.failedVisualSearch ||
      item.cardState === Constants.cardSearchState.failedCreate ||
      item.cardState === Constants.cardSearchState.failedMedia
    ) {
      setIsVisibleRemoveScan(true);
    } else {
      setIsVisibleEditScan(true);
    }
  };

  const handleUpdate = (tradingCardId, values) => {
    setIsUpdatingUserCard(true);

    actions.updateTradingCard(
      tradingCardId,
      values,
      {
        onComplete: () => {
          setIsUpdatingUserCard(false);
        },
        onError: (error) => {
          setIsUpdatingUserCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleEditAskingPrice = tradingCard => {
    setEditingTradingCard(tradingCard);

    const {marketplace} = profile?.flags || {};
    const {hasSellerSettings} = configuration || {};

    if (!marketplace || hasSellerSettings) {
      setIsVisibleSellCard(true);
    } else {
      setIsVisibleMarketplaceIntroduce(true);
    }
  };

  // const handleListCard = (value) => {
  //   const updatingCard = {
  //     ...editingTradingCard,
  //     listed: !!value,
  //     askingPrice: value,
  //   };

  //   updateCapturedCard({
  //     uuid: updatingCard.uuid,
  //     card: {
  //       ...updatingCard,
  //     },
  //   });
  // };

  const handlePossibleMatches = item => {
    navigation.navigate('SearchStackModal', {
      screen: 'PossibleMatches',
      params: {userCard: item, cardType},
    });
  };

  const handleEditCard = () => {
    // Edit card

    if (!capturedCards[currentCardIndex]) {
      return;
    }

    const handleBackSearch = () => {};

    setIsVisibleEditScan(false);

    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.edit);

    const currentCard = capturedCards[currentCardIndex];
    const tradingCardId = currentCard.tradingCardId || (currentCard.cardId && encodeId(Constants.base64Prefix.tradingCard, currentCard.id));

    actions.navigateEditCard({
      tradingCardId,
      isCloseBack: true,
      isCapture: false,
    });
  };

  const handleSearchCard = (index) => {
    const tradingCard = capturedCards[index];

    if (!tradingCard) {
      return;
    }

    const handleBackSearch = canonicalCardId => {
      const {tradingCardId} = tradingCard;

      if (!tradingCardId || !canonicalCardId) {
        updateCapturedCard({
          uuid: tradingCard.uuid,
          cardId: canonicalCardId,
          cardState: Constants.cardSearchState.failedCreate,
        });

        navigation.navigate('CaptureResult', {cardType});
        return;
      }

      const newTradingCard = {
        card: {
          id: canonicalCardId,
        },
      };

      setIsUpdatingUserCard(true);

      actions.updateTradingCard(
        tradingCardId,
        newTradingCard,
        {
          onComplete: () => {
            setIsUpdatingUserCard(false);

            updateCapturedCard({
              uuid: tradingCard.uuid,
              cardId: canonicalCardId,
            });
          },
          onError: (error) => {
            updateCapturedCard({
              uuid: tradingCard.uuid,
              cardId: canonicalCardId,
              cardState: Constants.cardSearchState.failedCreate,
            });

            setIsUpdatingUserCard(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          },
        },
      );

      navigation.navigate('CaptureResult', {cardType});
    };

    handleEditBottomSheet();
    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.capture);

    const {frontImageUrl, backImageUrl} = tradingCard;

    actions.navigateScanSearch({
      frontImageUrl,
      backImageUrl,
    });

    // Wrong card
    // const card = {
    //   uuid: capturedCards[currentCardIndex].uuid,
    //   cardState: Constants.cardSearchState.notDetected,
    //   frontImageUrl: capturedCards[currentCardIndex].frontImageUrl,
    //   backImageUrl: capturedCards[currentCardIndex].backImageUrl,
    // };
    // updateCapturedCard(card);
  };

  const handleRemoveCard = (index) => {
    // Remove card
    handleEditBottomSheet();

    const currentCard = capturedCards[index];

    if (!currentCard || (!currentCard.id && !currentCard.tradingCardId)) {
      removeCapturedCard({
        card: currentCard,
      });
      return;
    }

    const tradingCardId = currentCard.tradingCardId || (currentCard.cardId && encodeId(Constants.base64Prefix.tradingCard, currentCard.id));

    if (!tradingCardId) {
      return;
    }

    setIsUpdatingUserCard(true);

    actions.deleteTradingCards(
      [tradingCardId],
      {},
      {
        onComplete: () => {
          setIsUpdatingUserCard(false);

          removeCapturedCard({
            card: currentCard,
          });
        },
        onError: (error) => {
          setIsUpdatingUserCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleRetryUploadMedia = item => {
    reuploadUserCardMedia(item);
  };

  const handleRetryCreateUserCard = item => {
    recreateUserCard(item);
  };

  const handleRetryVisualSearch = item => {
    reuploadVisualSearch(item);
  };

  const handleUpdateListingPrice = (tradingCardId, newAskingPrice) => {
    handleCloseListingPriceSheet();

    setIsUpdatingUserCard(true);

    actions.updateTradingCardListingPrice(
      tradingCardId,
      newAskingPrice,
      {
        onComplete: () => {
          setIsUpdatingUserCard(false);
        },
        onError: (error) => {
          setIsUpdatingUserCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      }
    );
  };

  const handleCloseListingPriceSheet = () => {
    setIsVisibleSellCard(false);
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

  const renderItem = ({item, index}) => (
    <CaptureItem
      queryOptions={queryOptions}
      userCard={item}
      updatedCardIds={updatedCardIds}
      searchedCards={searchedCards}
      possibleMatchCards={possibleMatchCards}
      onPress={handleSelectCard}
      onUpdate={handleUpdate}
      onPressMoreActions={() => handleMoreActions(item, index)}
      onSearchCard={() => handleSearchCard(index)}
      onRemoveCard={() => handleRemoveCard(index)}
      onPressPossibleMatches={handlePossibleMatches}
      onRetryVisualSearch={handleRetryVisualSearch}
      onRetryCreateUserCard={handleRetryCreateUserCard}
      onRetryUploadMedia={handleRetryUploadMedia}
      onEditAskingPrice={handleEditAskingPrice}
    />
  );

  const renderButtonContent = () => {
    if (isUploadingCards) {
      return (
        <View style={styles.uploadingButtonContentContainer}>
          <LottieView
            style={styles.iconSearching}
            source={loadingIcon}
            autoPlay
          />
          <Text style={styles.textNormal}>Uploading...</Text>
        </View>
      );
    }

    const count = getCount(createdCardsCount);

    return (
      <>
        <Text style={styles.textNormal}>Add To Collection</Text>
        <Text style={styles.textAddedCards}>{`${count} Card${count > 1 ? 's' : ''}`}</Text>
      </>
    );
  };

  const renderBottomSheets = () => (
    <>
      <TradingCardListingSheet
        isVisible={isVisibleSellCard}
        tradingCard={editingTradingCard}
        onUpdateListingPrice={handleUpdateListingPrice}
        onClose={handleCloseListingPriceSheet}
      />
      <UserCardEditSheet
        isVisible={isVisibleEditScan}
        onEdit={handleEditCard}
        onSearch={() => handleSearchCard(currentCardIndex)}
        onRemove={() => handleRemoveCard(currentCardIndex)}
        onClose={handleEditBottomSheet}
      />
      <ScanRemoveSheet
        isVisible={isVisibleRemoveScan}
        onRemove={() => handleRemoveCard(currentCardIndex)}
        onClose={handleEditBottomSheet}
      />
      <MarketplaceIntroduceSheet
        isVisible={isVisibleMarketplaceIntroduce}
        onSetSellerSettings={handleSetSellerSettings}
        onSkip={handleSkipMarketplaceSettings}
        onClose={handleCloseMarketplaceSettings}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isFetching || isUpdatingUserCard} />
      {uploadingCards.length > 0 ? (
        <ProgressStep
          textStyle={styles.textUploadProgressTitle}
          title={isUploadingCards ? 'Uploading photos...' : null}
          currentStep={capturedCards.length - uploadingCards.length}
          totalSteps={capturedCards.length}
        />
      ) : null}
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        data={capturedCards || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={handleRefetch}
      />
      <Button
        style={[
          styles.addToCollectionButton,
          {
            marginBottom: styles.addToCollectionButton.marginBottom + Styles.screenSafeBottomHeight,
            backgroundColor: isUploadingCards || capturedCards.length === 0 ? colors.primaryAlpha5 : colors.primary,
          },
        ]}
        scaleDisabled={true}
        disabled={isUploadingCards || createdCardsCount === 0}
        onPress={handleAddToCollection}>
        {renderButtonContent()}
      </Button>
      {renderBottomSheets()}
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  listContainer: {},
  listContentContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.secondaryCardBackground,
  },
  addToCollectionButton: {
    flexDirection: 'column',
    height: 60,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  uploadingButtonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNormal: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  textAddedCards: {
    fontSize: 13,
    lineHeight: 24,
    letterSpacing: -0.41,
    color: Colors.white,
  },
  iconSearching: {
    width: Styles.cameraBottomBarCard.width * 1.5,
    height: Styles.cameraBottomBarCard.width * 1.5,
  },
  textUploadProgressTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
}));

export default withCaptureResult(CameraResultPage);
