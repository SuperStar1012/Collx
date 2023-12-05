import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, usePaginationFragment} from 'react-relay';

import {Button, FooterIndicator} from 'components';
import CollapseViewItem from './CollapseViewItem';

import {Constants, Styles} from 'globals';
import {createUseStyle, Fonts} from 'theme';

const CollapseSetsView = ({
  setViewer,
  onSelect,
}) => {
  const styles = useStyle();

  const {
    data: dataTradingCards,
    loadNext: loadNextTradingCards,
    isLoadingNext: isLoadingNextTradingCards,
    hasNext: hasNextTradingCards,
  } = usePaginationFragment(graphql`
    fragment CollapseSetsView_setViewer on SetViewer
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 40}
      after: {type: "String"}
      orderBy: {type: "[TradingCardOrder!]", defaultValue: [NEWEST_FIRST]}
      with: {type: "TradingCardsWith", defaultValue: {states: [LISTED, ACCEPTING_OFFERS, NOT_FOR_SALE, UNIDENTIFIED]}}
    )
    @refetchable(queryName: "CollapseSetsViewPaginationQuery") {
      setsTradingCards: tradingCards(after: $after, first: $first, orderBy: $orderBy, with: $with)
      @connection(key: "CollapseSetsView_setViewer__setsTradingCards") {
        edges {
          node {
            id
            ...CollapseViewItem_tradingCard
          }
        }
      }
    }`,
    setViewer
  );

  if (!dataTradingCards) {
    return null;
  }

  const handleLoadMore = () => {
    if (hasNextTradingCards) {
      loadNextTradingCards(Constants.collectionSetCardsFetchLimit * 2);
    }
  };

  const handleSelectCard = tradingCard => {
    if (onSelect) {
      onSelect(tradingCard);
    }
  };

  if (!dataTradingCards.setsTradingCards?.edges.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.textNoResult}>No Result</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {dataTradingCards.setsTradingCards?.edges?.map((item, index) => (
          <CollapseViewItem
            key={index}
            tradingCard={item.node}
            onPress={handleSelectCard}
          />
        ))}
      </View>
      {hasNextTradingCards && !isLoadingNextTradingCards ? (
        <Button
          style={styles.loadMoreButton}
          label="Load More"
          labelStyle={styles.textLoadMore}
          scale={Button.scaleSize.TWO}
          onPress={handleLoadMore}
        />
      ) : null}
      <FooterIndicator
        style={styles.footerIndicator}
        isLoading={isLoadingNextTradingCards}
      />
    </View>
  );
};

CollapseSetsView.defaultProps = {
  onSelect: () => {},
};

CollapseSetsView.propTypes = {
  onSelect: PropTypes.func,
};

export default CollapseSetsView;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    marginHorizontal: Styles.gridCardHorizontalPadding,
  },
  footerIndicator: {
    height: 30,
  },
  textNoResult: {
    fontSize: 13,
    color: colors.darkGrayText,
    marginVertical: 5,
    marginHorizontal: 44,
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textLoadMore: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.41,
    color: colors.grayText,
  }
}));
