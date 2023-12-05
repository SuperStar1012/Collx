import React, {Suspense, useEffect, useState, useRef} from 'react';
import {graphql, useLazyLoadQuery, usePaginationFragment} from 'react-relay';
import {FlatList, View} from 'react-native';
import _ from 'lodash';

import {
  LoadingIndicator,
  FooterIndicator,
  FollowerListItem,
  SearchBar,
} from 'components';

import {Constants} from 'globals';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {getCount} from 'utils';
import {createUseStyle} from 'theme';

const FollowingThemPage = (props) => {
  const {navigation, route} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <Suspense fallback={<LoadingIndicator isLoading />}>
          <Content navigation={navigation} profileId={route.params.profileId} />
        </Suspense>
      </View>
    </ActionContext.Provider>
  );
};

const Content = (props) => {
  const {navigation, profileId} = props;

  const queryData = useLazyLoadQuery(graphql`
    query FollowingThemPageQuery($profileId: ID!) {
      profile(with: {id: $profileId}) {
        name
        ...FollowingThemPageQuery_profile
        allFollowedBy: followedBy {
          totalCount
        }
        viewer {
          isMe
        }
      }
      viewer {
        ...FollowButton_viewer
      }
    }`,
    {profileId: profileId}
  );

  if (!queryData) {
    return null;
  }

  const totalCount = queryData.profile?.allFollowedBy?.totalCount;
  const isMe = queryData.profile?.viewer?.isMe
  const userProfileName = queryData.profile?.name;

  useEffect(() => {
    setNavigationBar();
  }, [totalCount]);

  const setNavigationBar = () => {
    if (!totalCount) {
      return;
    }

    navigation.setOptions({
      title: `${getCount(totalCount)} Follower${totalCount > 1 ? 's' : ''}`,
    });
  };

  return (
    <List
      profile={queryData.profile}
      viewer={queryData.viewer}
      isMe={isMe}
      name={userProfileName}
    />
  );
};

const List = (props) => {
  const {profile, viewer, isMe, name} = props;
  const styles = useStyle();
  const debouncedSearchFunc = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [selectMode, setSelectMode] = useState(Constants.collectionSelectMode.none);

  const {data: profileData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment FollowingThemPageQuery_profile on Profile
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
      with: {type: "FollowedByWith", defaultValue: {nameLike: ""}}
    )
    @refetchable(queryName: "FollowingThemListPaginationQuery") {
      followedBy(after: $after, first: $first, with: $with)
      @connection(key: "FollowingThemPageQuery_profile__followedBy") {
        edges {
          node {
            id
            ...FollowerListItem_profile
          }
        }
      }
    }`,
    profile
  );

  useEffect(() => {
    handleRefresh();
  }, [searchText]);

  if (!profileData) {
    return null;
  }

  const handleRefresh = () => {
    if (searchText) {
      refetch({
        with: {nameLike: searchText},
      }, {fetchPolicy: 'network-only'});
      return;
    }
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

  const renderItem = ({item: edge}) => (
    <FollowerListItem
      profile={edge.node}
      viewer={viewer}
    />
  );

  const handleChangeSearch = value => {
    if (debouncedSearchFunc.current) {
      debouncedSearchFunc.current.cancel();
    }

    debouncedSearchFunc.current = _.debounce(() => {
      debouncedSearchFunc.current = null;
      setSearchText(value);
    },
    500,
    {
      leading: false,
      trailing: true,
    });

    debouncedSearchFunc.current();
  };

  const handleDelete = () => {
    handleChangeSearch('');
  };

  const handleCancel = () => {
    handleChangeSearch('');
  };

  const renderHeader = () => (
    <SearchBar
      style={styles.searchBar}
      placeholder={`${isMe ? "My" : (name + "'s")} followers`}
      defaultValue={searchText}
      editable={selectMode === Constants.collectionSelectMode.none}
      onChangeText={handleChangeSearch}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  )

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      data={profileData?.followedBy?.edges || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefresh}
      refreshing={false}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

export default FollowingThemPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  searchBar: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 9,
  },
}));
