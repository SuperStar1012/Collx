import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Image,
  FollowButton,
  ProBadge,
} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {getCount, wp} from 'utils';
import {useActions} from 'actions';

const cardIcon = require('assets/icons/square_stack.png');

const FeaturedUsersItem = (props) => {
  const styles = useStyle();
  const actions = useActions();

  const profile = useFragment(graphql`
    fragment FeaturedUsersItem_profile on Profile {
      id
      isAnonymous
      avatarImageUrl
      name
      tradingCards {
        totalCount
      }
      viewer {
        isMe
        areTheyFollowingMe
      }
      ...FollowButton_profile
      ...ProBadge_profile
    }`,
    props.profile
  );

  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      activeOpacity={0.9}
      onPress={() => actions.pushProfile(profile.id)}>
      <Image
        source={
          profile.avatarImageUrl ||
          (profile.isAnonymous ? Constants.anonymousAvatar : Constants.defaultAvatar)
        }
        style={styles.imageAvatar}
      />
      <View style={styles.mainContainer}>
        <Text style={styles.textName} numberOfLines={1}>
          {profile.name}
        </Text>
        <ProBadge
          style={styles.proBadge}
          profile={profile}
        />
        <View>
          <View style={styles.cardsContainer}>
            <Image style={styles.iconCard} source={cardIcon} />
            <Text style={styles.textCards}>
              {getCount(profile.tradingCards?.totalCount)} Card{profile.tradingCards?.totalCount > 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={styles.textFollowYou}>
            {profile.viewer.areTheyFollowingMe &&
              'Follows you'
            }
          </Text>
        </View>
        {!profile.viewer.isMe &&
          <FollowButton profile={profile} viewer={props.viewer} />
        }
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedUsersItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: wp(44),
    height: wp(68),
    borderRadius: 10,
    backgroundColor: colors.primaryCardBackground,
    overflow: 'hidden',
    padding: 12,
    marginHorizontal: 5,
  },
  imageAvatar: {
    width: wp(26.5),
    height: wp(26.5),
    borderRadius: wp(14),
    alignSelf: 'center',
    marginBottom: 6,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textName: {
    fontFamily: Fonts.nunitoExtraBold,
    fontWeight: Fonts.extraBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.primaryText,
    textAlign: 'center',
  },
  proBadge: {
    marginHorizontal: 0,
    marginVertical: 8,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCard: {
    width: 18,
    height: 18,
    tintColor: colors.darkGrayText,
  },
  textCards: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginLeft: 3,
  },
  textFollowYou: {
    fontSize: 12,
    lineHeight: 18,
    height: 18,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 2,
  },
}));
