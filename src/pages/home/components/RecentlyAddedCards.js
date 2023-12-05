import React, {useEffect} from 'react';
import {graphql, useRefetchableFragment} from 'react-relay';
import {Text, FlatList, View} from 'react-native';

import {Button} from 'components';
import RecentlyAddedCardItem from './RecentlyAddedCardItem';

import {Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const chevronRightIcon = require('assets/icons/chevron_forward.png');

const RecentlyAddedCards = ({
  style,
  userCardsActionCount,
  profile,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const [profileData, refetch] = useRefetchableFragment(
    graphql`
      fragment RecentlyAddedCards_profile on Profile
      @argumentDefinitions(
        first: {type: "Int", defaultValue: 3}
        after: {type: "String"}
        orderBy: {type: "[TradingCardOrder!]", defaultValue: [NEWEST_FIRST]}
      )
      @refetchable(queryName: "RecentlyAddedCardsRefetchQuery") {
        tradingCards(after: $after, first: $first, orderBy: $orderBy) {
          edges {
            node {
              id
              ...RecentlyAddedCardItem_tradingCard
            }
          }
        }
      }
    `,
    profile
  );

  useEffect(() => {
    if (userCardsActionCount > 0) {
      refetch({}, {fetchPolicy: 'network-only'});
    }
  }, [userCardsActionCount]);

  if (!profileData.tradingCards?.edges?.length) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topContainer}>
        <Text style={styles.textTitle}>Recently Added</Text>
        <Button
          style={styles.seeAllButton}
          labelStyle={styles.textSeeAll}
          label="View Collection"
          iconStyle={styles.iconChevronRight}
          icon={chevronRightIcon}
          scale={Button.scaleSize.Two}
          onPress={actions.navigateMyCollection}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={profileData.tradingCards?.edges ?? []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item: edge}) => (
          <RecentlyAddedCardItem tradingCard={edge.node} />
        )}
      />
    </View>
  );
};

export default RecentlyAddedCards;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.primaryCardBackground,
  },
  contentContainer: {
    paddingTop: 12,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 6,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  seeAllButton: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  textSeeAll: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
  },
  iconChevronRight: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
}));
