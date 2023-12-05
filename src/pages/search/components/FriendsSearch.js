import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {FlatList, View, Text} from 'react-native';

import UsersSearchItem from './UsersSearchItem';

import {createUseStyle, Fonts} from 'theme';
import {useActions} from 'actions';

const FriendsSearch = ({
  style,
  viewer,
  profile,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const profileData = useFragment(graphql`
    fragment FriendsSearch_profile on Profile {
      followedBy(first: 5) {
        edges {
          node {
            ...UsersSearchItem_profile
          }
        }
      }
    }`,
    profile
  );

  if (!profileData?.followedBy?.edges?.length) {
    return null;
  }

  const handleSelectUser = profileId => {
    actions.pushProfile(profileId);
  };

  const renderItem = ({item: edge}) => (
    <UsersSearchItem
      viewer={viewer}
      profile={edge.node}
      onPress={handleSelectUser}
    />
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>
        Friends on CollX
      </Text>
      <FlatList
        scrollEnabled={false}
        data={profileData?.followedBy?.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default FriendsSearch;


const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 16,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    textTransform: 'capitalize',
    marginHorizontal: 16,
  }
}));
