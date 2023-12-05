import React, {Suspense, useCallback, useEffect, useState} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';
import {View, FlatList} from 'react-native';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  ListViewItem,
} from 'components';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {getCount} from 'utils';
import {createUseStyle} from 'theme';

const MatchingTradingCardsPage = ({navigation, route}) => {
  const {canonicalCardId} = route.params || {};

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
              canonicalCardId={canonicalCardId}
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
  canonicalCardId,
  queryOptions,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const cardData = useLazyLoadQuery(graphql`
    query MatchingTradingCardsPageQuery($canonicalCardId: ID!) {
      card(with: {id: $canonicalCardId}) {
        viewer {
          tradingCards {
            id
            ...ListViewItem_tradingCard
          }
        }
      }
    }`,
    {canonicalCardId},
    queryOptions,
  );

  if (!cardData) {
    return null;
  }

  const totalCount = cardData.card?.viewer?.tradingCards?.length;

  useEffect(() => {
    setNavigationBar();
  }, [totalCount]);

  const setNavigationBar = () => {
    if (!totalCount) {
      return;
    }

    navigation.setOptions({
      title: `${getCount(totalCount)} Matching Card${totalCount > 1 ? 's' : ''}`,
    });
  };

  const handleSelectCard = tradingCard => {
    if (tradingCard?.id) {
      actions.pushTradingCardDetail(tradingCard.id);
    }
  };

  const renderItem = ({item}) => (
    <ListViewItem
      style={styles.tradingCardContainer}
      tradingCard={item}
      onPress={handleSelectCard}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cardData.card?.viewer?.tradingCards || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MatchingTradingCardsPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  tradingCardContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
}));
