import React, {useMemo} from 'react';
import {graphql, useFragment, usePaginationFragment} from 'react-relay';
import {View, Text, FlatList} from 'react-native';

import {CommentLeave, FooterIndicator} from 'components';
import CommentItem from './CommentItem';

import {Constants, SchemaTypes} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const Comments = ({
  viewer,
  tradingCard,
  onLayout,
  onLeaveComment,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const viewerData = useFragment(graphql`
    fragment Comments_viewer on Viewer {
      profile {
        avatarImageUrl
      }
    }`,
    viewer
  );

  const {data: tradingCardData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment Comments_tradingCard on TradingCard
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "TradingCardCommentsPaginationQuery") {
      owner {
        viewer {
          isMe
          amIBlockingThem
        }
      }
      comments(after: $after, first: $first)
      @connection(key: "Comments_tradingCard__comments") {
        edges {
          node {
            id
            ...CommentItem_comment
          }
        }
      }
    }`,
    tradingCard
  );

  const isBlockedByThem = useMemo(() => {
    const {isMe, amIBlockingThem} = tradingCardData?.owner?.viewer || {};
    return !isMe && amIBlockingThem;
  }, [tradingCardData]);

  if (!tradingCardData) {
    return null;
  }

  const handleRefresh = () => {
    refetch({}, {fetchPolicy: 'network-only'});
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  const handleReportComment = commentId => {
    actions.navigateReportIssueDetail({
      forInput: {
        commentId,
      },
      issueType: SchemaTypes.issueType.COMMENT,
      isCloseBack: true,
    });
  };

  const handleSelectUser = userId => {
    actions.pushProfile(userId);
  };

  const renderItem = ({item: edge}) => (
    <CommentItem
      key={edge.node.id}
      comment={edge.node}
      isBlockedByThem={isBlockedByThem}
      onPressUser={handleSelectUser}
      onReplyComment={onLeaveComment}
      onReportComment={handleReportComment}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  if (!tradingCardData.comments?.edges?.length && isBlockedByThem) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.headerContainer}>
        <Text style={styles.textTitle}>Comments</Text>
      </View>
      {!isBlockedByThem ? (
        <CommentLeave
          avatarImageUrl={viewerData.profile.avatarImageUrl}
          onPress={onLeaveComment}
        />
      ) : null}
      {tradingCardData.comments?.edges?.length ? (
        <FlatList
          style={styles.listContainer}
          data={tradingCardData.comments.edges}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onRefresh={handleRefresh}
          refreshing={false}
          onEndReachedThreshold={0.2}
          onEndReached={handleEndReached}
        />
      ) : null}
    </View>
  );
};

export default Comments;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginBottom: 12,
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.secondaryCardBackground,
  },
}));
