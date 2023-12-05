import React, {useState, useRef, useEffect, useCallback, Suspense, useMemo} from 'react';
import {View, ScrollView} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  AIFloatingButton,
  FloatingButtonSize,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  NavBarModalHeader,
  NavBarButton,
} from 'components';
import CanonicalCardView from './components/CanonicalCardView';
import CardsView from './components/CardsView';
import MatchVariantList from './components/MatchVariantList';
import NavBarRightForCameraDrawer from './components/NavBarRightForCameraDrawer';
import DrawerActionSheet from './components/DrawerActionSheet';

import ActionContext, {
  useActions,
  createNavigationActions,
  createSharingActions,
} from 'actions';
import createActions from './actions';
import {Constants, Styles} from 'globals';
import {
  encodeCanonicalCardId,
  showErrorAlert,
  decodeId,
} from 'utils';
import { createUseStyle, useTheme, useThemeDispatch} from 'theme';
import {withCaptureResult} from 'store/containers';
import {
  analyticsEvents,
  analyticsSendEvent,
  analyticsNavigationRoute,
} from 'services';

const closeIcon = require('assets/icons/close.png');

const CameraDrawerPage = props => {
  const {
    navigation,
  } = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
    ...createSharingActions(),
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
              />
            </Suspense>
          </ErrorBoundaryWithRetry>
        </View>
      </ActionContext.Provider>
    </BottomSheetModalProvider>
  );
};

const Content = ({
  navigation,
  route,
  queryOptions,
  possibleMatchCards,
  setHandleSearchBack,
  setSearchModalMode,
  updateCapturedCard,
  removeCapturedCard,
  setPossibleMatchCards,
  setEmailVerifiedAction,
}) => {
  const {userCard, forcedDark} = route.params || {};
  const {tradingCardId} = userCard;

  const {setTheme} = useThemeDispatch();

  const styles = useStyle();
  const {selectedTheme} = useTheme();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query CameraDrawerPageQuery {
      viewer {
        profile {
          id
          type
        }
      }
    }`,
    {},
    queryOptions,
  );

  const [isVisibleActions, setIsVisibleActions] = useState(false);

  const [isUpdatingUserCard, setIsUpdatingUserCard] = useState(false);

  const matchCards = possibleMatchCards[userCard.uuid] || [];

  const simpleUserCard = useMemo(() => {
    return ({
      id: (userCard.tradingCardId && userCard.id) || userCard.cardId,
      type: userCard.type,
      frontImageUrl: userCard.front,
      backImageUrl: userCard.back,
    });
  }, [userCard]);

  const currentCardRef = useRef(
    matchCards.find(item => item.id === ((userCard.tradingCardId && userCard.id) || userCard.cardId)) || simpleUserCard
  );

  const [currentCard, setCurrentCard] = useState(currentCardRef.current);

  const canonicalCardId = useMemo(() => (
    encodeCanonicalCardId(currentCard.type, currentCard.id)
  ), [currentCard]);

  useEffect(() => {
    setNavigationBar();
  }, [styles]);

  useEffect(() => {
    if (forcedDark && selectedTheme === Constants.colorSchemeName.light) {
      setTheme(Constants.colorSchemeName.dark);
    }

    return () => {
      if (selectedTheme === Constants.colorSchemeName.light) {
        setTheme(Constants.colorSchemeName.light);
      }
    }
  }, [forcedDark]);

  useEffect(() => {
    currentCardRef.current = matchCards.find(item => item.id === userCard.id) || userCard;
    setCurrentCard(currentCardRef.current);
  }, [userCard, matchCards]);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
      headerRight: () => (
        <NavBarRightForCameraDrawer
          onShareUrl={handleShareUrl}
          onRemoveCard={handleRemoveCard}
          onShowMoreActions={handleShowMoreActions}
        />
      ),
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRemoveCard = () => {
    handleClose();

    removeCapturedCard({
      card: userCard,
    });
  };

  const handleShowMoreActions = () => {
    setIsVisibleActions(true);
  };

  const handleShareUrl = () => {
    actions.shareUrl(currentCardRef.current.shareUrl);

    if (currentCardRef.current.id) {
      analyticsSendEvent(
        analyticsEvents.sharedCard,
        {
          type: 'canonical',
          id: currentCardRef.current.id,
          name: currentCardRef.current.set,
        },
      );
    }
  };

  const updateTradingCard = (canonicalCardId) => {
    if (!tradingCardId || !canonicalCardId || !userCard.uuid) {
      return;
    }

    const tradingCard = {
      card: {
        id: canonicalCardId,
      },
    };

    setIsUpdatingUserCard(true);

    actions.updateTradingCard(
      tradingCardId,
      tradingCard,
      {
        onComplete: () => {
          setIsUpdatingUserCard(false);

          updateCapturedCard({
            uuid: userCard.uuid,
            cardId: canonicalCardId,
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

  const handleSelectVariant = variant => {
    currentCardRef.current = variant;
    setCurrentCard(currentCardRef.current);

    const possibleCards = possibleMatchCards[userCard.uuid];
    if (!possibleCards) {
      return;
    }

    const selectedCard = possibleCards.find(item => item.id === variant.id);
    if (selectedCard) {
      const canonicalCardId = encodeCanonicalCardId(selectedCard.type, selectedCard.id);
      updateTradingCard(canonicalCardId);
    }
  };

  const handleCloseActionsSheet = () => {
    setIsVisibleActions(false);
  };

  const handleReportCard = () => {
    handleCloseActionsSheet();

    if (currentCardRef.current) {
      const cardId = encodeCanonicalCardId(currentCardRef.current.type, currentCardRef.current.id);

      if (cardId) {
        actions.navigateReportIssue({
          forInput: {
            // tradingCardId,
            cardId,
          },
        });
      }
    }
  };

  const handleWrongCard = () => {
    handleCloseActionsSheet();

    const handleBackSearch = canonicalCardId => {
      updateTradingCard(canonicalCardId);

      const [, cardId] = decodeId(canonicalCardId);

      const newUserCard = {
        ...userCard,
        id: Number(cardId),
      }

      setPossibleMatchCards({
        uuid: userCard.uuid,
        cards: [], // TODO: Add the updated canonical card
      });

      currentCardRef.current = newUserCard;
      setCurrentCard(currentCardRef.current);

      navigation.navigate('CameraDrawer', {
        userCard: {
          ...userCard,
          ...newUserCard,
        }
      });
    };

    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.capture);

    const {frontImageUrl, backImageUrl} = userCard || {};

    actions.navigateScanSearch({
      frontImageUrl,
      backImageUrl,
    });
  };

  const handleOpenAIChat = () => {
    const {type: profileType} = viewerData.viewer?.profile || {};
    const isProUser = profileType === Constants.userType.pro;

    if (!isProUser) {
      actions.navigateCollXProModal({
        source: analyticsNavigationRoute.CameraDrawer,
      });

      return;
    }

    let canonicalCard = null;

    if (userCard) {
      canonicalCard = {
        number: userCard.number,
        name: userCard.name,
        set: {
          name: userCard.set,
        },
      };
    }

    setEmailVerifiedAction(() => {
      actions.navigateChatBotMessage({
        profileId: viewerData.viewer?.profile?.id,
        canonicalCard,
        isFromModal: true,
        source: analyticsNavigationRoute.CameraDrawer,
      });
    });
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdatingUserCard} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: Styles.screenSafeBottomHeight + FloatingButtonSize + 16,
        }}
      >
        <View style={styles.cardsContainer}>
          <CardsView
            frontImageUrl={userCard.frontImageUrl || userCard.front}
            backImageUrl={userCard.backImageUrl || userCard.back}
            canonicalCardId={canonicalCardId}
            queryOptions={queryOptions}
          />
          {matchCards.length > 0 ? (
            <MatchVariantList
              currentMatch={currentCard}
              variants={matchCards}
              onSelectVariant={handleSelectVariant}
            />
          ) : null}
        </View>
        {canonicalCardId ? (
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <CanonicalCardView
              canonicalCardId={canonicalCardId}
              queryOptions={queryOptions}
            />
          </Suspense>
        ) : null}
      </ScrollView>
      <AIFloatingButton
        onPress={handleOpenAIChat}
      />
      <DrawerActionSheet
        isVisible={isVisibleActions}
        onSearch={handleWrongCard}
        onReport={handleReportCard}
        onClose={handleCloseActionsSheet}
      />
    </View>
  );
};

export default withCaptureResult(CameraDrawerPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  cardsContainer: {
    backgroundColor: colors.secondaryCardBackground,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
}));
