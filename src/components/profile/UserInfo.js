import React from 'react';
import {useFragment, graphql} from 'react-relay'
import {View, Text} from 'react-native';

import {Image} from 'components';
import {ProBadge} from '../user';
import Avatar from './Avatar';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const verificationIcon = require('assets/icons/more/verification.png');

const UserInfo = ({
  style,
  profile
}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment UserInfo_profile on Profile {
      name
      username
      isAmbassador
      isAnonymous
      avatarImageUrl
      location
      status
      viewer {
        isMe
      }
      ...Avatar_profile
      ...ProBadge_profile
    }`,
    profile
  );

  if (!profileData.viewer.isMe && profileData.status === Constants.accountStatus.deleted) {
    return (
      <View style={[styles.container, style]}>
        <Image style={styles.imageAvatar} source={Constants.disabledAvatar} />
        <View style={styles.userInfoContainer}>
          <Text style={styles.textName}>Account Deleted</Text>
        </View>
      </View>
    );
  }

  const renderAmbassador = () => {
    if (!profileData.isAmbassador) {
      return null;
    }

    return (
      <View style={styles.rowContainer}>
        <Image style={styles.iconAmbassador} source={verificationIcon} />
        <Text style={[styles.textOther, styles.textAmbassador]}>Ambassador</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Avatar
        style={[styles.imageAvatar, styles.imageNormalAvatar]}
        profile={profileData}
      />
      <View style={styles.userInfoContainer}>
        <View style={[styles.rowContainer, styles.itemsContainer]}>
          {profileData.name ? (
            <Text style={styles.textName}>
              {profileData.name || Constants.unknownName}
            </Text>
          ) : (
            <Text style={[styles.textName, styles.textAnonymous]}>
              {Constants.defaultName}
            </Text>
          )}
          <ProBadge profile={profileData} />
        </View>
        <View style={[styles.rowContainer, styles.itemsContainer]}>
          {profileData.username ? (
            <Text style={[styles.textOther, styles.textUsername]}>
              @{profileData.username}
            </Text>
          ) : null}
          {renderAmbassador()}
        </View>
        {profileData.location ? (
          <Text style={[styles.textOther, styles.itemsContainer]}>
            {profileData.location}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default UserInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  imageAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  imageNormalAvatar: {
    backgroundColor: colors.secondaryCardBackground,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemsContainer: {
    marginVertical: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    flexShrink: 1,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primaryText,
  },
  textAnonymous: {
    color: colors.lightGrayText,
  },
  textOther: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
  },
  iconAmbassador: {
    width: 16,
    height: 16,
  },
  textUsername: {
    marginRight: 12,
  },
  textAmbassador: {
    color: Colors.softDarkGreen,
    marginLeft: 2,
  },
}));
