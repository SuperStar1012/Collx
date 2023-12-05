import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Image} from '../common';
import FollowButton from './FollowButton';
import CountAndLocation from './CountAndLocation';

import {useActions} from 'actions';
import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const FollowerListItem = React.memo((props) => {
  const actions = useActions();
  const styles = useStyle();

  const profile = useFragment(graphql`
    fragment FollowerListItem_profile on Profile {
      id
      name
      avatarImageUrl
      location
      tradingCards {
        totalCount
      }
      viewer {
        isMe
      }
      ...FollowButton_profile
    }`,
    props.profile
  );

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      activeOpacity={0.8}
      onPress={() => actions.pushProfile(profile.id)}>
      <Image
        style={styles.imageAvatar}
        source={profile.avatarImageUrl || Constants.defaultAvatar}
      />
      <View style={styles.mainContentContainer}>
        <Text style={styles.textName}>{profile.name || "Anonymous"}</Text>
        <CountAndLocation count={profile.tradingCards.totalCount} location={profile.location} />
      </View>
      {!profile.viewer.isMe &&
        <FollowButton profile={profile} viewer={props.viewer} />
      }
    </TouchableOpacity>
  );
});

FollowerListItem.displayName = 'FollowerListItem';

export default FollowerListItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mainContentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    marginHorizontal: 11,
  },
  textName: {
    fontWeight: Fonts.heavy,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
}));
