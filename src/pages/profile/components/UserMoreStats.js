import React from 'react';
import {useFragment, graphql} from 'react-relay'
import {View, Image, Text} from 'react-native';
import {Rating} from 'react-native-ratings';
import moment from 'moment';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {Constants} from 'globals';

const exclamationCircleIcon = require('assets/icons/exclamation_circle.png');
const tagIcon = require('assets/icons/tag_outline.png');
const shippingBoxIcon = require('assets/icons/shipping_box.png');
const clockArrowCircleIcon = require('assets/icons/clock_arrow_circle.png');
const starOutlineIcon = require('assets/icons/star_outline.png');

const getDays = (days) => {
  if (!days) {
    return null;
  }

  return `${days} day${days > 1 ? 's' : ''}`;
};

const UserMoreStats = ({
  style,
  profile,
}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment UserMoreStats_profile on Profile {
      id
      averageShipTime
      dateJoined
      lastActiveAt
      numberOfCardsSold
      ratingAsABuyer {
        average
        count
      }
      ratingAsASeller {
        average
        count
      }
    }`,
    profile
  );

  const {
    averageShipTime,
    dateJoined,
    lastActiveAt,
    numberOfCardsSold,
    ratingAsABuyer,
    ratingAsASeller,
  } = profileData;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.statsContainer}>
        <StatsItem
          icon={exclamationCircleIcon}
          label="Joined since"
          value={moment(dateJoined).format(Constants.joinedSinceDateFormat)}
        />
        {numberOfCardsSold ? (
          <StatsItem
            icon={tagIcon}
            label="Total cards sold:"
            value={numberOfCardsSold || 0}
          />
        ) : null}
        {averageShipTime ? (
          <StatsItem
            icon={shippingBoxIcon}
            label="Average ship time:"
            value={getDays(averageShipTime)}
          />
        ) : null}
        <StatsItem
          icon={clockArrowCircleIcon}
          label="Last active:"
          value={moment(lastActiveAt).fromNow()}
        />
        <RatingItem
          label="Seller rating"
          value={ratingAsASeller.average || 0}
          count={ratingAsASeller.count || 0}
        />
        <RatingItem
          label="Buyer rating"
          value={ratingAsABuyer.average || 0}
          count={ratingAsABuyer.count || 0}
        />
      </View>
    </View>
  );
};

const StatsItem = ({
  icon,
  label,
  value,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.itemContainer}>
      <Image style={styles.iconStats} source={icon} />
      <Text style={styles.textLabel}>{label}</Text>
      <Text style={styles.textValue}>{value}</Text>
    </View>
  );
};

const RatingItem = ({
  label,
  value,
  count,
}) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  return (
    <View style={styles.itemContainer}>
      <Image style={styles.iconStats} source={starOutlineIcon} />
      <Text style={styles.textLabel}>{label}</Text>
      <Rating
        type='custom'
        readonly
        ratingColor={colors.primary}
        tintColor={colors.primaryBackground}
        ratingBackgroundColor={colors.darkGrayText}
        imageSize={18}
        startingValue={value}
      />
      <Text style={styles.textLabel}>({count})</Text>
    </View>
  );
};

export default UserMoreStats;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  statsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
    paddingTop: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconStats: {
    width: 24,
    height: 24,
    tintColor: colors.grayText,
  },
  textLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    marginHorizontal: 4,
  },
  textValue: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
}));
