import React from 'react';
import {useFragment, graphql} from 'react-relay'
import {View} from 'react-native';

import UserCollectionStatsItem from './UserCollectionStatsItem';

import {createUseStyle} from 'theme';
import {getCount} from 'utils';
import {useActions} from 'actions';

const UserCollectionStats = ({
  style,
  profile
}) => {
  const styles = useStyle();
  const actions = useActions();

  const profileData = useFragment(graphql`
    fragment UserCollectionStats_profile on Profile {
      id
      tradingCards(with: {states: [LISTED, ACCEPTING_OFFERS, NOT_FOR_SALE, UNIDENTIFIED]}) {
        count
        marketValue {
          formattedAmount
        }
      }
      followedBy {
        totalCount
      }
      following {
        totalCount
      }
    }`,
    profile
  );

  const handleFollowers = () => {
    if (profileData.followedBy.totalCount > 0) {
      actions.navigateFollowers(profileData.id);
    }
  };

  const handleFollowing = () => {
    if (profileData.following.totalCount > 0) {
      actions.navigateFollowings(profileData.id);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <UserCollectionStatsItem
        label="Items"
        value={getCount(profileData.tradingCards.count)}
      />
      <View style={styles.borderLine} />
      <UserCollectionStatsItem
        label="Value"
        value={profileData.tradingCards.marketValue.formattedAmount}
      />
      <View style={styles.borderLine} />
      <UserCollectionStatsItem
        label="Followers"
        value={getCount(profileData.followedBy.totalCount)}
        onPress={handleFollowers}
      />
      <View style={styles.borderLine} />
      <UserCollectionStatsItem
        label="Following"
        value={getCount(profileData.following.totalCount)}
        onPress={handleFollowing}
      />
    </View>
  );
};

export default UserCollectionStats;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  borderLine: {
    height: '100%',
    width: 1,
    backgroundColor: colors.primaryBorder,
  },
}));
