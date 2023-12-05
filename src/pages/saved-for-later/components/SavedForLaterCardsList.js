import React, {Suspense, useEffect, useState} from 'react';
import {graphql, useFragment} from 'react-relay';
import {View, FlatList} from 'react-native';

import {
  LoadingIndicator,
  DealCardItem,
} from 'components';
import NoResult from './NoResult';

import {useActions} from 'actions';
import {createUseStyle} from 'theme';
import {showErrorAlert} from 'utils';

const SavedForLaterCardsList = ({
  savedForLater
}) => {

  const actions = useActions();
  const styles = useStyle();

  const savedForLaterData = useFragment(graphql`
    fragment SavedForLaterCardsList_savedForLater on SavedForLater {
      tradingCards(first: 50)
      @connection(key: "SavedForLaterCardsList_savedForLater__tradingCards") {
        edges {
          node {
            ...DealCardItem_tradingCard,
          }
        }
      }
    }`,
    savedForLater
  );

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (savedForLaterData?.tradingCards?.edges.length) {
      return;
    }

    // go back
    actions.navigateGoBack();
  }, [savedForLaterData?.tradingCards])

  const handleAddToDeal = (sellerId, tradingCardId) => {
    setIsUpdating(true);

    actions.removeTradingCardsFromSavedForLater(
      [tradingCardId],
      true,
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

  const handleRemoveCard = (sellerId, tradingCardId) => {
    setIsUpdating(true);

    actions.removeTradingCardsFromSavedForLater(
      [tradingCardId],
      false,
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

  const handleSelectCard = (tradingCardId) => {
    actions.pushTradingCardDetail(tradingCardId);
  };

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdating} />
      <FlatList
        style={styles.container}
        contentContainerStyle={savedForLaterData?.tradingCards?.edges?.length > 0 ? {} : styles.contentContainer}
        data={savedForLaterData.tradingCards?.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: edge, index}) => (
          <Suspense key={index} fallback={<LoadingIndicator isLoading />}>
            <DealCardItem
              tradingCard={edge.node}
              onSelectCard={handleSelectCard}
              onAddToDeal={handleAddToDeal}
              onRemoveCard={handleRemoveCard}
            />
          </Suspense>
        )}
        ListEmptyComponent={<NoResult />}
      />
    </View>
  );
};

export default SavedForLaterCardsList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
