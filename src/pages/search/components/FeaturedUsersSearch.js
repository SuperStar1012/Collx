import React from 'react';
import {graphql, useFragment} from 'react-relay';
import {Text, FlatList, View} from 'react-native';

import UsersSearchItem from './UsersSearchItem';

import {Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';

const FeaturedUsersSearch = ({
  style,
  viewer,
  recommendations,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const recommendationsData = useFragment(graphql`
    fragment FeaturedUsersSearch_recommendations on Recommendations {
      profilesToFollow(first: 10) {
        edges {
          node {
            id
            ...UsersSearchItem_profile
          }
        }
      }
    }`,
    recommendations
  );

  if (!recommendationsData?.profilesToFollow?.edges?.length) {
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
      <Text style={styles.textTitle}>Featured Users</Text>
      <FlatList
        scrollEnabled={false}
        data={recommendationsData.profilesToFollow.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default FeaturedUsersSearch;

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
