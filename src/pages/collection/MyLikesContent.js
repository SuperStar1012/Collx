import React, {useEffect, useRef, useState, Suspense, useMemo, useCallback} from 'react';
import {
  View,
  Animated,
  Image,
  Alert,
} from 'react-native';
import {graphql, useFragment, usePaginationFragment} from 'react-relay';

import {Constants} from 'globals';
import {createUseStyle, useTheme, Fonts} from 'theme';

import { GridViewItem } from '../../components';
import {
  KeyboardAvoidingSectionList,
  FooterIndicator,
} from 'components';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions'
import {groupBySet, getSectionTitle} from 'utils';
import {usePrevious} from 'hooks';

const MyLikesContent = ({
  navigation,
  viewer,
}) => {
  const scrollViewRef = useRef(null);

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
  };

  const {data: myLikesData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment MyLikesContentMyQuery_viewer on Viewer
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      orderBy: {type: "[TradingCardOrder!]", defaultValue: [NEWEST_FIRST]}
    )
    @refetchable(queryName: "MyLikesContentMyQuery") {
      likedTradingCards(after: $after, first: $first, orderBy: $orderBy)
      @connection(key: "MyLikesContentMyQuery_viewer__likedTradingCards") {
        edges {
          node {
            id
            featured
            condition {
              name
            }
            card {
              year
              set {
                name
              }
              ...on SportCard {
                player {
                  name
                }
                team {
                  name
                }
              }
            }
            ...GridViewItem_tradingCard
          }
        }
      }
    }`,
    viewer
  );

  if (!myLikesData) {
    return null;
  }

  const tradingCardSections = useMemo(() => (
    groupBySet(myLikesData.likedTradingCards?.edges || [], '', 2, '')
  ), [myLikesData.likedTradingCards]);

  const handleRefetch = () => {
    refetch({}, {
      fetchPolicy: 'network-only',
    });
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  }

  const handleSelectItem = tradingCard => {
    const tradingCardId = tradingCard?.id;

    actions.pushTradingCardDetail(tradingCardId);
  };

  const renderItems = ({item}) => {
    return (
      <View style={styles.dataListContainer}>
        {item.map((item, index) => renderItem(item.node, index))}
      </View>
    )
  };

  const handleLike = (tradingCardId, isLike) => {
    if (!tradingCardId) {
      return;
    }

    if (isLike) {
      actions.dislikeTradingCard(tradingCardId)
    } else {
      actions.likeTradingCard(tradingCardId)
    }
  };

  const renderItem = (tradingCard, index) => {
    return (
      <GridViewItem
        key={index}
        onToggleLike={handleLike}
        tradingCard={tradingCard}
        onPress={handleSelectItem}
      />
    );
  };

  return (
    <KeyboardAvoidingSectionList
      keyExtractor={(item, index) => index.toString()}
      ref={ref => {
        scrollViewRef.current = ref;
      }}
      style={[styles.container]}
      contentContainerStyle={[styles.contentContainer]}
      sections={tradingCardSections}
      renderItem={renderItems}
      onRefresh={handleRefetch}
      refreshing={isLoadingNext}
      onEndReached={handleEndReached}
      ListFooterComponent={<FooterIndicator isLoading={isLoadingNext} />}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: colors.primaryBackground,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  dataListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

export default MyLikesContent;
