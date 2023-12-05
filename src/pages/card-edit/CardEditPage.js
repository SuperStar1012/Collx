import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import _ from 'lodash';

import {
  LoadingIndicator,
  NavBarButton,
  NavBarModalHeader,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import CardEditContent from './CardEditContent';

import {withCardAddEdit} from 'store/containers';
import {Constants, SchemaTypes} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {isPrice, showErrorAlert} from 'utils';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {uploadUserCardPhotosToCloud} from 'store/apis';

const CardEditPage = props => {
  const {
    navigation,
    route,
    updateUserCardsCount,
    setSearchModalMode,
    setHandleSearchBack,
  } = props;

  const {tradingCardId, isCloseBack, isCapture} = route.params;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  const [currentCard, setCurrentCard] = useState({});
  const [isDisabledSave, setIsDisabledSave] = useState(true);
  const [canonicalCardId, setCanonicalCardId] = useState(null);

  const [isUpdatingUserCard, setIsUpdatingUserCard] = useState(false);
  const [isUploadingUserCardMedia, setIsUploadingUserCardMedia] = useState(false);
  const [isRemovingUserCard, setIsRemovingUserCard] = useState(false);

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  useEffect(() => {
    setNavigationBar();
  }, [isDisabledSave, currentCard]);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const setNavigationBar = () => {
    let moreOptions = {
      headerRight: () => (
        <NavBarButton
          label="Save"
          style={styles.navBarButton}
          labelStyle={styles.textNavBarDone}
          disabled={isDisabledSave}
          onPress={handleSave}
        />
      ),
    };

    if (isCloseBack) {
      moreOptions = {
        ...moreOptions,
        headerLeft: () => (
          <NavBarButton
            style={styles.navBarButton}
            label="Cancel"
            onPress={handleClose}
          />
        ),
      };
    }

    navigation.setOptions({
      header: NavBarModalHeader,
      title: 'Edit Card Details',
      ...moreOptions,
    });
  };

  const updateUserCard = () => {
    const {
      ...tradingCard
    } = currentCard;

    if (_.has(tradingCard, 'purchasePrice')) {
      if (tradingCard.purchasePrice) {
        tradingCard.purchasePrice = {
          amount: tradingCard.purchasePrice * 100,
          currencyCode: SchemaTypes.currencyCode.USD,
        };
      } else {
        tradingCard.purchasePrice = null;
      }
    }

    delete tradingCard.salePrice;
    delete tradingCard.askingPrice;
    delete tradingCard.listingStatus;

    delete tradingCard.backImageUploadUrl;
    delete tradingCard.backImageUrl;
    delete tradingCard.frontImageUploadUrl;
    delete tradingCard.frontImageUrl;

    if (canonicalCardId) {
      tradingCard.card = {
        id: canonicalCardId,
      }
    }

    setIsUpdatingUserCard(true);

    if (Object.keys(tradingCard).length) {
      actions.updateTradingCard(
        tradingCardId,
        tradingCard,
        {
          onComplete: () => {
            updateSalePrices();
          },
          onError: (error) => {
            setIsUpdatingUserCard(false);

            if (error?.message) {
              showErrorAlert(error?.message);
            }
          },
        },
      );
    } else {
      // TODO: Clean up later
      updateSalePrices();
    }
  };

  const updateSalePrices = () => {
    const {
      salePrice,
      askingPrice,
      listingStatus,
      } = currentCard;

    const isMarkedAsSold = _.has(currentCard, 'salePrice') && _.has(currentCard, 'listingStatus');

    if (_.has(currentCard, 'askingPrice')) {
      if (askingPrice) {
        actions.updateTradingCardListingPrice(
          tradingCardId,
          askingPrice,
          {
            onComplete: () => {
              if (isMarkedAsSold) {
                soldTradingCard(salePrice, listingStatus);
                return;
              }

              setIsUpdatingUserCard(false);
              uploadUserCardMedia();
            },
            onError: (error) => {
              setIsUpdatingUserCard(false);

              if (error?.message) {
                showErrorAlert(error?.message);
              }
            },
          },
        );
      } else {
        actions.removeTradingCardAskingPrice(
          tradingCardId,
          {
            onComplete: () => {
              if (isMarkedAsSold) {
                soldTradingCard(salePrice, listingStatus);
                return;
              }

              setIsUpdatingUserCard(false);
              uploadUserCardMedia();
            },
            onError: (error) => {
              setIsUpdatingUserCard(false);

              if (error?.message) {
                showErrorAlert(error?.message);
              }
            },
          }
        );
      }

      return;
    } else if (isMarkedAsSold) {
      soldTradingCard(salePrice, listingStatus);
      return;
    }

    setIsUpdatingUserCard(false);
    uploadUserCardMedia();
  };

  const soldTradingCard = (salePrice, listingStatus) => {
    actions.soldTradingCard(
      tradingCardId,
      salePrice,
      listingStatus,
      {
        onComplete: () => {
          setIsUpdatingUserCard(false);
          uploadUserCardMedia();
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

  const uploadUserCardMedia = async() => {
    setIsUploadingUserCardMedia(true);

    if (currentCard.frontImageUrl || currentCard.backImageUrl) {
      try {
        const imageValues = await uploadUserCardPhotosToCloud({
          tradingCardId,
          frontImageUrl: currentCard.frontImageUrl,
          backImageUrl: currentCard.backImageUrl,
          frontImageUploadUrl: currentCard.frontImageUploadUrl,
          backImageUploadUrl: currentCard.backImageUploadUrl,
        });

        if (imageValues && Object.keys(imageValues).length) {
          actions.updateTradingCardImage(tradingCardId, imageValues);
        }
      } catch (error) {
        console.log(error);
      }
    }

    setIsUploadingUserCardMedia(false);

    handleClose();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    updateUserCard();
  };

  const handleChangeValues = values => {
    setCurrentCard(values);

    const {listingStatus, askingPrice, purchasePrice} = values;

    const disabled =
      !Object.keys(values).length ||
      (listingStatus === SchemaTypes.tradingCardState.LISTED && (!askingPrice || !isPrice(askingPrice))) ||
      // (
      //   (listingStatus === SchemaTypes.soldTradingCardType.COLLX || listingStatus === SchemaTypes.soldTradingCardType.OTHER) &&
      //   (!salePrice || !isPrice(salePrice))
      // ) ||
      (purchasePrice && !isPrice(purchasePrice));

    if (isDisabledSave !== disabled) {
      setIsDisabledSave(!!disabled);
    }
  };

  const handleRemove = () => {
    if (!tradingCardId) {
      return;
    }

    setIsRemovingUserCard(true);

    actions.deleteTradingCards(
      [tradingCardId],
      {},
      {
        onComplete: () => {
          setIsRemovingUserCard(false);
          updateUserCardsCount();
          navigation.navigate('CollectionFilterDrawer');
        },
        onError: (error) => {
          setIsRemovingUserCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleSearchCard = () => {
    const handleBackSearch = cardId => {
      if (cardId) {
        setCanonicalCardId(cardId);
        setIsDisabledSave(false);
      }

      actions.navigateEditCard(route.params);
    };

    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.edit);

    navigation.navigate('DatabaseSearchAllResult', {
      savedSearchSource: SchemaTypes.savedSearchSource.COLLECTION,
    });
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading isModalMode />}>
            <LoadingIndicator
              isLoading={isUpdatingUserCard || isUploadingUserCardMedia || isRemovingUserCard}
              isModalMode
            />
            <CardEditContent
              navigation={navigation}
              isEdit={true}
              isRemove={isCapture}
              isCapture={isCapture}
              canonicalCardId={canonicalCardId}
              tradingCardId={canonicalCardId ? null : tradingCardId}
              queryOptions={refreshedQueryOptions}
              onChangeValues={handleChangeValues}
              onSearchCard={handleSearchCard}
              onRemove={handleRemove}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  textNavBarDone: {
    fontWeight: Fonts.bold,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
}));

export default withCardAddEdit(CardEditPage);
