import React from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';
import RecentListingItem from './RecentListingItem';

import {Fonts, createUseStyle} from 'theme';
import {openEbayUrl} from 'utils';
import {useActions} from 'actions';

const recentListingsCount = 5;

const RecentListings = ({
  style,
  card,
  gradeName,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const cardData = useFragment(graphql`
    fragment RecentListings_card on Card {
      year
      number
      name
      set {
        name
      }
      ...on SportCard {
        player {
          name
        }
      }
      recentTradingCards: tradingCards(
        first: 5,
        orderBy: [UPDATED_AT_DESC]
        with: {states: [LISTED]}
      ) {
        count
        edges {
          node {
            id
            ...RecentListingItem_tradingCard
          }
        }
      }
    }`,
    card,
  );

  const handleSelect = (item) => {
    actions.pushTradingCardDetail(item.id);
  };

  const handleViewMore = () => {
    const query = {};
    let search = '';

    if (cardData.number) {
      search += `${search ? ' ' : '#'}${cardData.number}`;
    }

    if (cardData.name || cardData.player?.name) {
      search += `${search ? ' ' : ''}${cardData.name || cardData.player?.name}`;
    }

    if (cardData.set?.name) {
      search += `${search ? ' ' : ''}${cardData.set?.name}`;
    }

    if (search) {
      query.q = search;
    }

    if (Object.keys(query)) {
      actions.navigateSearchSaleCards({
        query,
      });
    }
  };

  const handleForSale = () => {
    openEbayUrl(cardData, gradeName, false);
  };

  const renderRecentList = () => {
    if (!cardData.recentTradingCards?.count) {
      return null;
    }

    return (
      <>
        <Text style={styles.textTitle}>Recent Listings</Text>
        <View style={styles.listContainer}>
          {cardData.recentTradingCards?.edges?.map((edge, index) => (
            <RecentListingItem
              key={index}
              tradingCard={edge.node}
              onPress={() => handleSelect(edge.node)}
            />
          ))}
        </View>
      </>
    );
  };

  const renderViewMoreButton = () => {
    if (cardData.recentTradingCards?.count <= recentListingsCount) {
      return null;
    }

    return (
      <Button
        style={[styles.button, styles.viewMoreButton]}
        label="View More on CollX"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleViewMore}
      />
    );
  };

  const renderSaleButton = () => {
    if (!cardData.year || !cardData.set?.name || !cardData.number || !cardData.player?.name || !gradeName) {
      return null;
    }

    return (
      <Button
        style={styles.button}
        label="For Sale on eBay"
        labelStyle={styles.textButton}
        scale={Button.scaleSize.One}
        onPress={handleForSale}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderRecentList()}
      {renderViewMoreButton()}
      {renderSaleButton()}
    </View>
  );
};

export default RecentListings;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginVertical: 12,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
    marginBottom: 12,
  },
  button: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  textButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
}));
