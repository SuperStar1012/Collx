import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
} from 'react-native';

import CommentUser from './CommentUser';

import {Fonts, createUseStyle} from 'theme';

const CommentReplyItem = ({reply, onPressUser}) => {
  const replyData = useFragment(graphql`
    fragment CommentReplyItem_reply on Comment {
      text
      ...CommentUser_comment
    }`,
    reply
  );

  const styles = useStyle();

  const handleSelectUser = (userId) => {
    if (onPressUser) {
      onPressUser(userId);
    }
  };

  return (
    <View style={styles.container}>
      <CommentUser
        avatarStyle={styles.imageAvatar}
        nameStyle={styles.textFullName}
        dateStyle={styles.textDate}
        comment={replyData}
        onPress={handleSelectUser}
      />
      <View style={styles.mainContainer}>
        <Text style={styles.textComment}>{replyData.text}</Text>
      </View>
    </View>
  );
};

export default CommentReplyItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginLeft: 48,
    marginRight: 16,
    marginVertical: 6,
  },
  mainContainer: {
    flex: 1,
    marginLeft: 24,
  },
  imageAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  textFullName: {
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginHorizontal: 3,
  },
  textDate: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.004,
    color: colors.lightGrayText,
  },
  textComment: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginTop: 2,
  },
}));
