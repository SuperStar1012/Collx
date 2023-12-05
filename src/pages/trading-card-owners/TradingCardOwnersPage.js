import React, {Suspense, useCallback, useEffect, useState} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {View} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import TradingCardOwnerCardInfo from './components/TradingCardOwnerCardInfo';
import TradingCardOwnerList from './components/TradingCardOwnerList';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {getCount} from 'utils';
import {createUseStyle} from 'theme';

const TradingCardOwnersPage = ({navigation, route}) => {
  const {cardId} = route.params || {};

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions(prev => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    refresh: handleRefresh,
  }

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              navigation={navigation}
              cardId={cardId}
              queryOptions={refreshedQueryOptions}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  )
};

const Content = ({
  navigation,
  cardId,
  queryOptions,
}) => {
  const styles = useStyle();

  const cardData = useLazyLoadQuery(graphql`
    query TradingCardOwnersPageQuery($cardId: ID!) {
      card(with: {id: $cardId}) {
        allTradingCards: tradingCards {
          totalCount
        }
        ...TradingCardOwnerCardInfo_card
        ...TradingCardOwnerList_card
      }
    }`,
    {cardId},
    queryOptions,
  );

  if (!cardData) {
    return null;
  }

  const totalCount = cardData.card.allTradingCards.totalCount;

  useEffect(() => {
    setNavigationBar();
  }, [totalCount]);

  const setNavigationBar = () => {
    if (!totalCount) {
      return;
    }

    navigation.setOptions({
      title: `${getCount(totalCount)} User${totalCount > 1 ? 's' : ''} With This Card`,
    });
  };

  return (
    <View style={styles.container}>
      <TradingCardOwnerCardInfo card={cardData.card} />
      <TradingCardOwnerList card={cardData.card} />
    </View>
  );
};

export default TradingCardOwnersPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
