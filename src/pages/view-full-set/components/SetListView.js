import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, usePaginationFragment} from 'react-relay';

import {FooterIndicator} from 'components';
import SetListViewCanonicalCardItem from './SetListViewCanonicalCardItem';
import SetListViewTradingCardItem from './SetListViewTradingCardItem';

import {Constants, Styles} from 'globals';

const SetListView = ({
  profileId,
  set,
  onSelectCanonicalCard,
  onSelectTradingCard,
  onRefresh,
}) => {
  let fragmentData = null;

  if (profileId) {
    fragmentData = usePaginationFragment(graphql`
      fragment SetListViewOther_set on Set
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 40}
        after: {type: "String"}
        orderBy: {type: "[CardOrder!]", defaultValue: [NUMBER]}
        profileId: {type: "ID"}
      )
      @refetchable(queryName: "SetListViewOtherCanonicalCardsPaginationQuery") {
        cards(after: $after, first: $first, orderBy: $orderBy)
        @connection(key: "SetListViewOther_set__cards") {
          edges {
            node {
              id
              ...on SportCard {
                number
              }
              ...on GameCard {
                number
              }
              viewer (asProfile: $profileId) {
                tradingCards {
                  id
                  owner {
                    id
                  }
                  card {
                    ...on SportCard {
                      number
                    }
                    ...on GameCard {
                      number
                    }
                  }
                  ...SetListViewTradingCardItem_tradingCard
                }
              }
              ...SetListViewCanonicalCardItem_card
            }
          }
        }
      }`,
      set
    );
  } else {
    fragmentData = usePaginationFragment(graphql`
      fragment SetListViewMy_set on Set
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 40}
        after: {type: "String"}
        orderBy: {type: "[CardOrder!]", defaultValue: [NUMBER]}
      )
      @refetchable(queryName: "SetListViewMyCanonicalCardsPaginationQuery") {
        cards(after: $after, first: $first, orderBy: $orderBy)
        @connection(key: "SetListViewMy_set__cards") {
          edges {
            node {
              id
              ...on SportCard {
                number
              }
              ...on GameCard {
                number
              }
              viewer {
                tradingCards {
                  id
                  owner {
                    id
                  }
                  card {
                    ...on SportCard {
                      number
                    }
                    ...on GameCard {
                      number
                    }
                  }
                  ...SetListViewTradingCardItem_tradingCard
                }
              }
              ...SetListViewCanonicalCardItem_card
            }
          }
        }
      }`,
      set
    );
  }

  const {
    data: dataCanonicalCard,
    loadNext: loadNextCanonicalCard,
    isLoadingNext: isLoadingNextCanonicalCard,
    hasNext: hasNextCanonicalCard,
    refetch: refetchCanonicalCard,
  } = fragmentData;

  if (!dataCanonicalCard) {
    return null;
  }

  const allCards = useMemo(() => {
    const cards = [];
    dataCanonicalCard.cards?.edges?.map((canonicalCard) => {
      const tradingCards = canonicalCard.node.viewer?.tradingCards || [];
      if (tradingCards.length) {
        tradingCards.map((tradingCard) => {
          cards.push(tradingCard);
        });
      } else {
        cards.push(canonicalCard.node);
      }
    });

    return cards;
  }, [dataCanonicalCard]);

  const handleRefetch = () => {
    refetchCanonicalCard({}, {
      fetchPolicy: 'network-only',
    });

    if (onRefresh) {
      onRefresh();
    }
  };

  const handleEndReached = () => {
    if (isLoadingNextCanonicalCard) {
      return;
    }

    if (hasNextCanonicalCard) {
      loadNextCanonicalCard(Constants.defaultFetchLimit * 2);
    }
  };

  const handleSelectCanonicalCard = canonicalCard => {
    if (onSelectCanonicalCard) {
      onSelectCanonicalCard(canonicalCard);
    }
  };

  const handleSelectTradingCard = tradingCard => {
    if (onSelectTradingCard) {
      onSelectTradingCard(tradingCard);
    }
  };

  const renderItem = ({item}) => {
    if (item.owner) {
      return (
        <SetListViewTradingCardItem
          tradingCard={item}
          onPress={handleSelectTradingCard}
        />
      );
    }

    return (
      <SetListViewCanonicalCardItem
        canonicalCard={item}
        onPress={handleSelectCanonicalCard}
      />
    );
  };

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNextCanonicalCard} />
  );

  return (
    <FlatList
      contentContainerStyle={{
        paddingBottom: Styles.collectionActionBarHeight + Styles.collectionActionBarMarginBottom
      }}
      refreshing={isLoadingNextCanonicalCard}
      data={allCards}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefetch}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

SetListView.defaultProps = {
  onSelect: () => {},
  onRefresh: () => {},
};

SetListView.propTypes = {
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default SetListView;
