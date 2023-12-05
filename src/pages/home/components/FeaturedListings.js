import React, { useEffect } from 'react';
import {graphql, useRefetchableFragment} from 'react-relay';
import {Text, FlatList, View} from 'react-native';

import FeaturedListingsItem from './FeaturedListingsItem';

import {Fonts, createUseStyle} from 'theme';

const FeaturedListings = ({
  style,
  recommendations,
  category,
}) => {
  const styles = useStyle();

  const [recommendationsData, refetch] = useRefetchableFragment(
    graphql`
      fragment FeaturedListings_recommendations on Recommendations
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 10}
        after: {type: "String"}
        with: {type: "TradingCardsWith"}
      )
      @refetchable(queryName: "FeaturedListingsRefetchQuery") {
      listedTradingCards(after: $after, first: $first, with: $with) {
        edges {
          node {
            id
            ...FeaturedListingsItem_tradingCard
          }
        }
      }
    }`,
    recommendations
  );

  useEffect(() => {
    const options = {};

    if (category?.sport) {
      options.sport = category.sport;
    } else if (category?.game) {
      options.game = category.game;
    }

    refetch({with: options}, {fetchPolicy: 'network-only'});
  }, [category]);

  if (!recommendationsData.listedTradingCards?.edges?.length) {
    return null;
  }

  const renderItem = ({item: edge}) => <FeaturedListingsItem tradingCard={edge.node} />;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>Featured Listings</Text>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recommendationsData.listedTradingCards.edges ?? []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default FeaturedListings;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 8,
  },
}));
