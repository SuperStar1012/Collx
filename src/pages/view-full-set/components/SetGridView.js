import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, usePaginationFragment} from 'react-relay';

import {FooterIndicator} from 'components';
import SetGridViewCanonicalCardItem from './SetGridViewCanonicalCardItem';
import SetGridViewTradingCardItem from './SetGridViewTradingCardItem';

import {Constants, Styles} from 'globals';
import {createUseStyle} from 'theme';

const SetGridView = ({
  profileId,
  set,
  onSelectCanonicalCard,
  onSelectTradingCard,
  onRefresh,
}) => {
  const styles = useStyle();

  let fragmentData = null;

  if (profileId) {
    fragmentData = usePaginationFragment(graphql`
      fragment SetGridViewOther_set on Set
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 40}
        after: {type: "String"}
        orderBy: {type: "[CardOrder!]", defaultValue: [NUMBER]}
        profileId: {type: "ID"}
      )
      @refetchable(queryName: "SetGridViewOtherCanonicalCardsPaginationQuery") {
        cards(after: $after, first: $first, orderBy: $orderBy)
        @connection(key: "SetGridView_set__cards") {
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
                  ...SetGridViewTradingCardItem_tradingCard
                }
              }
              ...SetGridViewCanonicalCardItem_card
            }
          }
        }
      }`,
      set
    );
  } else {
    fragmentData = usePaginationFragment(graphql`
      fragment SetGridViewMy_set on Set
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 40}
        after: {type: "String"}
        orderBy: {type: "[CardOrder!]", defaultValue: [NUMBER]}
      )
      @refetchable(queryName: "SetGridViewMyCanonicalCardsPaginationQuery") {
        cards(after: $after, first: $first, orderBy: $orderBy)
        @connection(key: "SetGridView_set__cards") {
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
                  ...SetGridViewTradingCardItem_tradingCard
                }
              }
              ...SetGridViewCanonicalCardItem_card
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
  }

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
        <SetGridViewTradingCardItem
          tradingCard={item}
          onPress={handleSelectTradingCard}
        />
      );
    }

    return (
      <SetGridViewCanonicalCardItem
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
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: Styles.collectionActionBarHeight + Styles.collectionActionBarMarginBottom}
      ]}
      refreshing={isLoadingNextCanonicalCard}
      data={allCards}
      keyExtractor={(item, index) => index.toString()}
      numColumns={5}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefetch}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

SetGridView.defaultProps = {
  onSelect: () => {},
  onRefresh: () => {},
};

SetGridView.propTypes = {
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default SetGridView;

const useStyle = createUseStyle(() => ({
  contentContainer: {
    paddingHorizontal: 8,
  },
}));
