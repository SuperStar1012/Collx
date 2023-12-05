import React, {Suspense, useEffect, useState, useCallback} from 'react';
import {Platform, View} from 'react-native';
import _ from 'lodash';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  NavBarButton,
  NavBarModalHeader,
  LoadingIndicator,
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
import {analyticsNavigationRoute} from 'services';

const CardAddPage = props => {
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
              onRefetch={handleRefresh}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = props => {
  const {
    navigation,
    route,
    updateUserCardsCount,
    queryOptions,
  } = props;

  const {canonicalCardId, isCloseBack} = route.params;

  const styles = useStyle();
  const actions = useActions();

  const [currentCard, setCurrentCard] = useState({});
  const [isDisabledSave, setIsDisabledSave] = useState(false);
  const [isCreatingUserCard, setIsCreatingUserCard] = useState(false);
  const [isUpdatingUserCard, setIsUpdatingUserCard] = useState(false);
  const [isUploadingUserCardMedia, setIsUploadingUserCardMedia] = useState(false);

  const viewerData = useLazyLoadQuery(graphql`
    query CardAddPageQuery {
      viewer {
        profile {
          type
          tradingCards(with: {states: [ACCEPTING_OFFERS, LISTED, NOT_FOR_SALE, SOLD, UNIDENTIFIED]}) {
            count
          }
        }
      }
    }`,
    {},
    queryOptions
  );

  const {profile} = viewerData.viewer || {};

  useEffect(() => {
    setNavigationBar();
  }, [isDisabledSave, currentCard]);

  const setNavigationBar = () => {
    let moreOptions = {
      headerRight: () => (
        <NavBarButton
          label="Add"
          labelStyle={styles.textNavBarDone}
          disabled={isDisabledSave}
          onPress={handleSave}
        />
      ),
    };

    if (isCloseBack) {
      moreOptions = {
        ...moreOptions,
        headerLeft: () => <NavBarButton label="Cancel" onPress={handleClose} />,
      };
    }

    navigation.setOptions({
      header: NavBarModalHeader,
      title: 'Add To Collection',
      ...moreOptions,
    });
  };

  const createUserCard = () => {
    const {type: profileType, tradingCards} = profile || {};
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser && ((tradingCards.count || 0) + 1) > Constants.userCardsLimitInCollection) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.AddCard,
      });

      return;
    }

    const from = {
      cardId: canonicalCardId,
    };

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

    setIsCreatingUserCard(true);

    delete tradingCard.salePrice;
    delete tradingCard.askingPrice;
    delete tradingCard.listingStatus;

    delete tradingCard.backImageUploadUrl;
    delete tradingCard.backImageUrl;
    delete tradingCard.frontImageUploadUrl;
    delete tradingCard.frontImageUrl;

    actions.createTradingCard(
      from,
      {
        ...tradingCard,
        platform: Platform.OS.toUpperCase(),
        source: SchemaTypes.tradingCardSource.SEARCH,
        // captureType: '',
      },
      {
        onComplete: (response) => {
          setIsCreatingUserCard(false);

          if (!response || !response.id) {
            handleClose();
            return;
          }

          // TODO: Clean up later
          updateSalePrices(response);

          updateUserCardsCount();
        },
        onError: (error) => {
          console.log(error);
          setIsCreatingUserCard(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const updateSalePrices = (tradingCard) => {
    const {askingPrice} = currentCard;

    const tradingCardId = tradingCard?.id;

    if (_.has(currentCard, 'askingPrice')) {
      setIsUpdatingUserCard(true);

      if (askingPrice) {
        actions.updateTradingCardListingPrice(
          tradingCardId,
          askingPrice,
          {
            onComplete: () => {
              setIsUpdatingUserCard(false);
              uploadUserCardMedia(tradingCard);
            },
            onError: (error) => {
              setIsUpdatingUserCard(false);

              if (error?.message) {
                showErrorAlert(error?.message);
              }
            },
          }
        );
      } else {
        actions.removeTradingCardAskingPrice(
          tradingCardId,
          {
            onComplete: () => {
              setIsUpdatingUserCard(false);
              uploadUserCardMedia(tradingCard);
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
    }

    uploadUserCardMedia(tradingCard);
  };

  const uploadUserCardMedia = async(tradingCard) => {
    setIsUploadingUserCardMedia(true);

    const {
      frontImageUploadUrl,
      backImageUploadUrl,
    } = tradingCard?.viewer || {}

    if (currentCard.frontImageUrl || currentCard.backImageUrl) {
      try {
        const imageValues = await uploadUserCardPhotosToCloud({
          tradingCardId: tradingCard.id,
          frontImageUrl: currentCard.frontImageUrl,
          backImageUrl: currentCard.backImageUrl,
          frontImageUploadUrl,
          backImageUploadUrl,
        });

        if (imageValues && Object.keys(imageValues).length) {
          actions.updateTradingCardImage(tradingCard.id, imageValues);
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
    createUserCard();
  };

  const handleChangeValues = values => {
    setCurrentCard(values);

    const {listingStatus, askingPrice, purchasePrice} = values;

    const disabled =
      !Object.keys(values).length ||
      (listingStatus === SchemaTypes.tradingCardState.LISTED && (!askingPrice || !isPrice(askingPrice))) ||
      (purchasePrice && !isPrice(purchasePrice));

    if (isDisabledSave !== disabled) {
      setIsDisabledSave(disabled);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isCreatingUserCard || isUpdatingUserCard || isUploadingUserCardMedia} />
      <CardEditContent
        navigation={navigation}
        canonicalCardId={canonicalCardId}
        isEdit={false}
        isRemove={false}
        isCapture={true}
        queryOptions={queryOptions}
        onChangeValues={handleChangeValues}
      />
    </View>
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
}));

export default withCardAddEdit(CardAddPage);
