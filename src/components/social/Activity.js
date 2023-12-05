import React, { useMemo } from 'react';
import {useFragment, graphql} from 'react-relay'
import {View, FlatList} from 'react-native';

import Comment from './Comment';
import ActivityProfileSummary from './ActivityProfileSummary';
import TradingCardActivity from '../trading-card/TradingCardActivity'

import {useActions} from 'actions';
import {Constants} from 'globals';
import {Colors, createUseStyle} from 'theme';
import {wp} from 'utils';

const Activity = ({
  style,
  viewer,
  activity,
  onLeaveComment,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const activityData = useFragment(graphql`
    fragment Activity_activity on Activity {
      __typename
      id
      at
      featured
      who {
        id
        name
        viewer {
          ...TradingCardActivity_profileViewer
          ...Comment_profileViewer
        }
        ...ActivityProfileSummary_who
        ...Comment_commenter
      }
      ...on AddedCardsActivity {
        cards: tradingCards {
          id
          ...TradingCardActivity_tradingCard
        }
      }
      ...on ListedCardForSaleActivity {
        card: tradingCard {
          id
          ...TradingCardActivity_tradingCard
        }
      }
      ...on SoldCardActivity {
        card: tradingCard {
          id
          ...TradingCardActivity_tradingCard
        }
      }
      ...on CommentedOnCardActivity {
        comment {
          ...Comment_comment
        }
        card: tradingCard {
          owner {
            name
          }
          id
          ...TradingCardActivity_tradingCard
        }
      }
      ...on RepliedToCommentActivity {
        comment {
          ...Comment_comment
        }
        # card: tradingCard {
        #   owner {
        #     name
        #   }
        #   id
        #   ...TradingCardActivity_tradingCard
        # }
      }
    }`,
    activity,
  );

  const viewerData = useFragment(graphql`
    fragment Activity_viewer on Viewer {
      ...Comment_viewer
    }`,
    viewer
  );

  const isCommentActivity = useMemo(() => (
    activityData?.__typename === 'CommentedOnCardActivity' || activityData?.__typename === 'RepliedToCommentActivity'
  ), [activityData?.__typename]);

  const handleLeaveComment = commentId => {
    if (onLeaveComment) {
      onLeaveComment({
        activityId: activityData.id,
        tradingCardId: activityData?.card?.id,
        commentId,
      });
    }
  }

  const handleSelectUser = () => {
    if (activityData.who?.id) {
      actions.pushProfile(activityData.who?.id);
    }
  };

  const renderItem = ({item: card}) => (
    <TradingCardActivity
      style={styles.cardItemContainer}
      profileViewer={activityData.who.viewer}
      tradingCard={card}
    />
  );

  const renderActivities = () => {
    if (activityData?.card || activityData?.cards?.length === 1) {
      return (
        <View style={styles.cardsContainer}>
          <TradingCardActivity
            profileViewer={activityData.who.viewer}
            tradingCard={activityData?.card || activityData?.cards[0]}
          />
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={styles.cardsContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={activityData.cards}
        keyExtractor={(card) => card.id}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ActivityProfileSummary
        profile={activityData.who}
        featured={activityData.featured}
        timestamp={activityData.at}
        summary={getSummaryForActivity(activityData)}
        onPress={handleSelectUser}
      />
      {renderActivities()}
      {isCommentActivity ? (
        <Comment
          commenter={activityData.who}
          comment={activityData.comment}
          viewer={viewerData}
          profileViewer={activityData.who.viewer}
          onLeaveComment={handleLeaveComment}
        />
      ) : null}
    </View>
  );
};

const getSummaryForActivity = (activity) => {
  const activityUserName = activity.who?.name || Constants.defaultName;

  switch (activity.__typename) {
    case 'CommentedOnCardActivity':
      if (activity.card?.owner) {
        return ({
          activityUserName,
          description: `commented on ${activity.card.owner.name}'s card`,
        });
      } else {
        return ({
          activityUserName,
          description: 'commented on a card',
        });
      }
    case 'RepliedToCommentActivity':
      return ({
        activityUserName,
        description: 'replied on a comment',
      });
    case 'AddedCardsActivity':
      if (activity.cards?.length > 1) {
        return ({
          activityUserName,
          description: `added ${activity.cards.length} cards to their collection`,
        });
      } else {
        return ({
          activityUserName,
          description: 'added a card to their collection',
        });
      }
    case 'SoldCardActivity':
      return ({
        activityUserName,
        description: 'sold a card',
      });
    case 'ListedCardForSaleActivity':
      return ({
        activityUserName,
        description: 'listed a card for sale',
      });
  }
  return ({
    activityUserName,
    description: '',
  });
};

export default Activity;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingBottom: 12,
    shadowColor: Colors.gray,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
    backgroundColor: colors.primaryCardBackground,
  },
  cardsContainer: {
    paddingHorizontal: 6,
    paddingTop: 12,
  },
  cardItemContainer: {
    width: wp(78),
  },
}));
