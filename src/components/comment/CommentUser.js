import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

import Avatar from '../profile/Avatar';

import {Fonts, createUseStyle} from 'theme';

const CommentUser = ({
  style = {},
  avatarStyle = {},
  nameStyle = {},
  dateStyle = {},
  comment,
  onPress,
}) => {
  const styles = useStyle();

  const commentData = useFragment(graphql`
    fragment CommentUser_comment on Comment {
      at
      who {
        id
        name
        ...Avatar_profile
      }
    }`,
    comment
  );

  const handlePress = () => {
    if (onPress) {
      onPress(commentData.who.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <Avatar
        style={[styles.imageAvatar, avatarStyle]}
        profile={commentData.who}
      />
      <Text style={[styles.textFullName, nameStyle]}>
        {commentData.who?.name || 'Unknown'}
      </Text>
      <Text style={[styles.textDate, dateStyle]}>
        {moment(commentData.at).fromNow()}
      </Text>
    </TouchableOpacity>
  );
};

export default CommentUser;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
}));
