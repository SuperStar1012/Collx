import React from 'react';
import {View, FlatList} from 'react-native';
import {graphql, usePaginationFragment} from 'react-relay';

import {
  LoadingIndicator,
  FooterIndicator,
} from 'components';
import UserFollowItem from './UserFollowItem';

import {useActions} from 'actions';
import {Constants, Styles} from 'globals';
import {createUseStyle} from 'theme';

const FeaturedUsersList = ({
  viewer,
  recommendations,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const {data: queryData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment FeaturedUsersList_recommendations on Recommendations
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "FeaturedUsersListPaginationQuery") {
      profilesToFollow(after: $after, first: $first)
      @connection(key: "FeaturedUsersList_recommendations__profilesToFollow") {
        edges {
          node {
            id
            ...UserFollowItem_profile
          }
        }
      }
    }`,
    recommendations
  );

  if (!queryData) {
    return null;
  }

  const handleProfile = (profileId) => {
    actions.pushProfile(profileId);
  };

  const handleRefresh = () => {
    refetch({}, {fetchPolicy: 'network-only'});
  };

  const handleEndReached = () => {
    if (isLoadingNext) {
      return;
    }

    if (hasNext) {
      loadNext(Constants.defaultFetchLimit);
    }
  };

  const renderItem = ({item}) => (
    <UserFollowItem
      viewer={viewer}
      profile={item.node}
      onPress={handleProfile}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={!!queryData.profilesToFollow?.edges.length && isLoadingNext} />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={!queryData.profilesToFollow?.edges.length && isLoadingNext} />
      <FlatList
        contentContainerStyle={{paddingBottom: Styles.screenSafeBottomHeight}}
        data={queryData.profilesToFollow?.edges || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshing={false}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.2}
        onEndReached={handleEndReached}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default FeaturedUsersList;
