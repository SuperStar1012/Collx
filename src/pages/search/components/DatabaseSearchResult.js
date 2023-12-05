import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import UniversalSectionHeader from './UniversalSectionHeader';
import DatabaseItem from './DatabaseItem';

import {createUseStyle} from 'theme';
import {Constants} from 'globals';

const DatabaseSearchResult = ({
  search,
  onSelectCanonicalCard,
  onChangeSearchCategory,
  onViewAllCanonicalCards,
}) => {
  const styles = useStyle();

  const allCardsData = useFragment(graphql`
    fragment DatabaseSearchResultSearch on Search 
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 3}
      after: {type: "String"}
      canonicalCardsWith: {type: "SearchCardsWith"}
    ) {
      cards(after: $after, first: $first, with: $canonicalCardsWith) {
        edges {
          node {
            ...DatabaseItem_card
          }
        }
      }
    }`,
    search
  );

  const {cards} = allCardsData || {};

  const isHasCards = !!cards?.edges?.length;

  useEffect(() => {
    if (onChangeSearchCategory) {
      onChangeSearchCategory(Object.keys(Constants.searchCategories)[0], isHasCards);
    }
  }, [isHasCards]);

  if (!isHasCards) {
    return null;
  }

  const handleSelect = cardId => {
    if (cardId && onSelectCanonicalCard) {
      onSelectCanonicalCard(cardId);
    }
  };

  const handleViewAll = () => {
    if (onViewAllCanonicalCards) {
      onViewAllCanonicalCards();
    }
  };

  const renderHeader = () => (
    <UniversalSectionHeader
      title="Database"
      onViewAll={handleViewAll}
    />
  );

  const renderItem = ({item}) => (
    <DatabaseItem
      card={item.node}
      onPress={handleSelect}
    />
  );

  return (
    <FlatList
      style={styles.container}
      data={cards?.edges || []}
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexGrow: 0,
    backgroundColor: colors.primaryBackground,
    paddingBottom: 8,
  },
}));

export default DatabaseSearchResult;
