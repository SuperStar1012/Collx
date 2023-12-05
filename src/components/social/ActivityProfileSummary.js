import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {FormattedText} from 'react-native-formatted-text';
import moment from 'moment';

import {Avatar} from '../profile';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {isValidateUserName} from 'utils';

const ActivityProfileSummary = ({
  style,
  featured,
  timestamp,
  summary,
  profile,
  onPress,
}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment ActivityProfileSummary_who on Profile {
      name
      ...Avatar_profile
    }`,
    profile
  );

  const userName = profileData?.name;

  const renderUserName = () => {
    if (isValidateUserName(userName)) {
      return (
        <FormattedText
          style={styles.textUserDescription}
          matches={[{text: `${userName || Constants.defaultName}`, style: styles.textName}]}>
          {`${summary.activityUserName} ${summary.description}`}
        </FormattedText>
      );
    }

    return (
      <Text style={styles.textUserDescription}>
        <Text style={styles.textName}>{summary.activityUserName}</Text>
        {` ${summary.description}`}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={onPress}>
      <Avatar style={styles.imageAvatar} profile={profileData} />
      <View
        style={[
          styles.userTextsContainer,
          featured && styles.userTextsFeaturedContainer,
        ]}>
        {renderUserName()}
        <Text style={styles.textDate}>{moment(timestamp).fromNow()}</Text>
      </View>
      {featured &&
        <View style={styles.featuredContainer}>
          <Text style={styles.textFeatured}>Featured</Text>
        </View>
      }
    </TouchableOpacity>
  );
};

export default ActivityProfileSummary;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  imageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userTextsContainer: {
    flex: 1,
    marginLeft: 8,
  },
  userTextsFeaturedContainer: {
    marginRight: 63,
  },
  textName: {
    fontWeight: Fonts.bold,
  },
  textUserDescription: {
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textDate: {
    fontWeight: Fonts.semiBold,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
  },
  featuredContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 63,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: colors.primary,
  },
  textFeatured: {
    fontWeight: Fonts.semiBold,
    fontSize: 10,
    letterSpacing: -0.004,
    color: Colors.white,
  },
}));
