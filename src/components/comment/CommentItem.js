import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
} from 'react-native';

import {Button} from 'components';
import CommentUser from './CommentUser';
import CommentReplyItem from './CommentReplyItem';
import CommentSwipeable from './CommentSwipeable';

import {Fonts, createUseStyle} from 'theme';

const CommentItem = ({
  comment,
  isBlockedByThem,
  onPressUser,
  onReplyComment,
  onReportComment,
}) => {
  const styles = useStyle();

  const commentData = useFragment(graphql`
    fragment CommentItem_comment on Comment {
      id
      text
      viewer {
        isMine
      }
      replies {
        ...CommentReplyItem_reply
      }
      ...CommentUser_comment
    }`,
    comment
  );

  const handleReportComment = () => {
    if (onReportComment) {
      onReportComment(commentData.id);
    }
  };

  const handleReplyComment = () => {
    if (onReplyComment) {
      onReplyComment(commentData.id);
    }
  };

  const handleSelectUser = (userId) => {
    if (onPressUser) {
      onPressUser(userId);
    }
  };

  const renderComment = () => (
    <>
      <CommentUser comment={commentData} onPress={handleSelectUser} />
      <View style={styles.mainContainer}>
        <Text style={styles.textComment}>{commentData.text}</Text>
        {!isBlockedByThem ? (
          <Button
            style={styles.replyButton}
            labelStyle={styles.textReply}
            label="Reply"
            scale={Button.scaleSize.Four}
            onPress={handleReplyComment}
          />
        ) : null}
      </View>
    </>
  );

  return (
    <>
      {!commentData?.viewer?.isMine ? (
        <CommentSwipeable
          style={styles.container}
          onReport={handleReportComment}
        >
          {renderComment()}
        </CommentSwipeable>
      ) : (
        <View style={styles.container}>
          {renderComment()}
        </View>
      )}
      {commentData.replies?.map((reply, index) => (
        <CommentReplyItem
          key={index}
          reply={reply}
          onPressUser={handleSelectUser}
        />
      ))}
    </>
  );
};

export default CommentItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    marginLeft: 32,
  },
  imageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  textFullName: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 8,
  },
  textDate: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.lightGrayText,
  },
  textComment: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginTop: 2,
  },
  replyButton: {
    paddingTop: 6,
    alignSelf: 'flex-start',
  },
  textReply: {
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.004,
    color: colors.primary,
  },
}));
