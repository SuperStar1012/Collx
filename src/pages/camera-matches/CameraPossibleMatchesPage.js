import React, {Suspense, useEffect, useMemo, useCallback, useState} from 'react';
import {View, FlatList} from 'react-native';

import {
  NavBarButton,
  NavBarModalHeader,
  Button,
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import CardMatchItem from './components/CardMatchItem';

import ActionContext, {
  useActions,
  createNavigationActions,
} from 'actions';
import {Constants, Styles, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {withEditCaptureCard} from 'store/containers';
import {encodeCanonicalCardId, showErrorAlert} from 'utils';

const closeIcon = require('assets/icons/close.png');

const CameraPossibleMatchesPage = props => {

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
    possibleMatchCards,
    setHandleSearchBack,
    setSearchModalMode,
    updateCapturedCard,
    removeCapturedCard,
  } = props;
  const {userCard, cardType} = route.params;
  const {tradingCardId} = userCard;

  const styles = useStyle();
  const actions = useActions();

  const [isUpdatingUserCard, setIsUpdatingUserCard] = useState(false);

  const possibleCards = useMemo(() => (
    possibleMatchCards[userCard.uuid].filter(item => item.id !== userCard.id)
  ), [possibleMatchCards, userCard]);

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      header: NavBarModalHeader,
      title: 'Other Possible Matches',
      headerLeft: () => (
        <NavBarButton
          icon={closeIcon}
          iconStyle={styles.iconClose}
          onPress={handleClose}
        />
      ),
    });
  };

  const updateMatchCard = (canonicalCardId, onBack = () => {}) => {
    if (!canonicalCardId) {
      onBack();
      return;
    }

    const tradingCard = {
      card: {
        id: canonicalCardId,
      },
    };

    if (!tradingCardId) {
      return;
    }

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

          onBack();
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

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSearchCard = () => {
    // Search card
    const handleBackSearch = canonicalCardId => {
      updateMatchCard(canonicalCardId);
      navigation.navigate('CaptureResult', {cardType});
    };

    setHandleSearchBack(handleBackSearch);
    setSearchModalMode(Constants.searchModalMode.capture);

    navigation.navigate('DatabaseSearchAllResult', {
      savedSearchSource: SchemaTypes.savedSearchSource.CAMERA,
    });
  };

  const handleRemoveCard = () => {
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
          handleClose();

          removeCapturedCard({
            card: userCard,
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

  const handleSelectCard = item => {
    const canonicalCardId = encodeCanonicalCardId(item.type, item.id);
    updateMatchCard(canonicalCardId, handleClose);
  };

  const renderItem = ({item}) => (
    <CardMatchItem {...item} onSelect={() => handleSelectCard(item)} />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator
        isLoading={isUpdatingUserCard}
        isModalMode
      />
      <FlatList
        data={possibleCards}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        style={styles.normalButton}
        scaleDisabled={true}
        label="Search Cards"
        labelStyle={styles.textNormalButton}
        onPress={handleSearchCard}
      />
      <Button
        style={[
          styles.removeButton,
          {
            marginBottom:
              styles.removeButton.marginBottom + Styles.screenSafeBottomHeight,
          },
        ]}
        scaleDisabled={true}
        label="Remove Scan"
        labelStyle={[styles.textNormalButton, styles.textRemoveButton]}
        onPress={handleRemoveCard}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryCardBackground,
  },
  iconClose: {
    width: 28,
    height: 28,
  },
  normalButton: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.primary,
  },
  removeButton: {
    height: 48,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  textNormalButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  textRemoveButton: {
    color: Colors.red,
  },
}));

export default withEditCaptureCard(CameraPossibleMatchesPage);
