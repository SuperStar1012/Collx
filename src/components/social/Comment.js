import React from 'react';
import {useFragment, graphql} from 'react-relay';
import {
  View,
  Text,
  Image,
} from 'react-native';
import {useActions} from 'actions';
import moment from 'moment';

import {Button} from '../common';
import {CommentLeave} from '../comment';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const likeIcon = require('assets/icons/heart_circle_fill.png');


const AvatarButton = ({profile}) => {
  const actions = useActions();
  const styles = useStyle();

  return (
    <View style={styles.avatarContainer}>
      <View style={styles.verticalLine} />
      <Button
        style={styles.avatarButton}
        iconStyle={styles.imageAvatar}
        icon={profile.avatarImageUrl || Constants.defaultAvatar}
        onPress={() => actions.pushProfile(profile.id)}
      />
    </View>
  );
}


const Content = ({comment}) => {
  const styles = useStyle();

  return (
    <View style={styles.commentContentContainer}>
      <View style={styles.nameAndTimeContainer}>
        <Text
          style={[styles.textNormal, styles.textName]}
          numberOfLines={1}
        >
          {comment.who?.name}
        </Text>
        <Text
          style={[styles.textNormal, styles.textDate]}
          numberOfLines={1}
        >
          {moment(comment.at).fromNow()}
        </Text>
      </View>
      <Text style={[styles.textNormal, styles.textComment]}>
        {comment.text}
      </Text>
    </View>
  );
}

const Actions = ({comment, onLeaveComment}) => {
  const actions = useActions();
  const styles = useStyle();

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.actionsSubContainer}>
        <Button
          style={styles.actionButton}
          labelStyle={styles.textAction}
          label={comment.viewer.likedByMe ? 'Liked' : 'Like'}
          scale={Button.scaleSize.Four}
          onPress={() =>
            comment.viewer.isLikedByMe
              ? actions.dislikeComment(comment.id)
              : actions.likeComment(comment.id)
          }
        />
        <Button
          style={styles.actionButton}
          labelStyle={styles.textAction}
          label="Reply"
          scale={Button.scaleSize.Four}
          onPress={() => onLeaveComment(comment.id)}
        />
      </View>
      {comment.likes?.totalCount ? (
        <View style={styles.actionsSubContainer}>
          <Text style={styles.textLikes}>{comment.likes.totalCount}</Text>
          <Image style={styles.iconLike} source={likeIcon} />
        </View>
      ) : null}
    </View>
  );
}

const Comment = ({
  style,
  viewer,
  commenter,
  comment,
  profileViewer,
  onLeaveComment,
}) => {
  const styles = useStyle();

  const commentData = useFragment(graphql`
    fragment Comment_comment on Comment {
      id
      at
      who {
        avatarImageUrl
        name
        viewer {
          isMe
        }
      }
      text
      likes {
        totalCount
      },
      viewer {
        isLikedByMe
      }
    }`,
    comment
  );

  const commenterData = useFragment(graphql`
    fragment Comment_commenter on Profile {
      id
      name
      avatarImageUrl
    }`,
    commenter
  );

  const viewerData = useFragment(graphql`
    fragment Comment_viewer on Viewer {
      profile {
        avatarImageUrl
      }
    }`,
    viewer
  );

  const profileViewerData = useFragment(graphql`
    fragment Comment_profileViewer on ProfileViewer {
      isMe
      amIBlockingThem
    }`,
    profileViewer
  );

  const isBlockedByThem = !profileViewerData?.isMe && profileViewerData?.amIBlockingThem;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.userContainer}>
        <AvatarButton profile={commenterData} />
        <View style={styles.commentContainer}>
          <Content comment={commentData} />
          {!isBlockedByThem ? (
            <Actions
              comment={commentData}
              onLeaveComment={onLeaveComment}
            />
          ) : null}
        </View>
      </View>
      {!commentData.who.viewer.isMe && !isBlockedByThem ? (
        <CommentLeave
          style={styles.leaveCommentContainer}
          avatarImageUrl={viewerData?.profile?.avatarImageUrl}
          onPress={onLeaveComment}
        />
      ) : null}
    </View>
  );
}

export default Comment;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  userContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarButton: {
    width: 24,
    height: 24,
  },
  imageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  verticalLine: {
    width: 1,
    height: 16,
    backgroundColor: colors.primaryBorder,
  },
  commentContainer: {
    flex: 1,
    marginLeft: 6,
    marginTop: 16,
  },
  commentContentContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 6,
    backgroundColor: colors.secondaryCardBackground,
  },
  nameAndTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textNormal: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  textName: {
    fontWeight: Fonts.semiBold,
    color: colors.primaryText,
  },
  textDate: {
    flex: 1,
    color: colors.darkGrayText,
    marginLeft: 6,
  },
  textComment: {
    flex: 1,
    color: colors.primaryText,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionsSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 8,
  },
  textAction: {
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
  },
  textLikes: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginRight: 4,
  },
  iconLike: {
    width: 18,
    height: 18,
    tintColor: Colors.lightRed,
  },
  leaveCommentContainer: {
    paddingHorizontal: 12,
  },
}));
