import React from 'react';
import {graphql, usePaginationFragment} from 'react-relay';
import {FlatList} from 'react-native';

import {FooterIndicator} from 'components';
import SavedForLaterListItem from './SavedForLaterListItem'
import NoResult from './NoResult';

import {Constants} from 'globals';
import {useActions} from 'actions';
import {createUseStyle} from 'theme';

const SavedForLaterList = (props) => {
  const actions = useActions();
  const styles = useStyle();

  const {data: viewerData, loadNext, isLoadingNext, hasNext, refetch} = usePaginationFragment(graphql`
    fragment SavedForLaterListQuery_viewer on Viewer
    @argumentDefinitions(
      first: {type: "Int", defaultValue: 20}
      after: {type: "String"}
    )
    @refetchable(queryName: "SavedForLaterListPaginationQuery") {
      savedForLater(after: $after, first: $first)
      @connection(key: "SavedForLaterListQuery_viewer__savedForLater") {
        edges {
          node {
            ...SavedForLaterListItem_savedForLater
            ...SavedForLaterCardsList_savedForLater
          }
        }
      }
    }`,
    props.viewer
  );

  if (!viewerData) {
    return null;
  }

  const handleRefetch = () => {
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

  const handleSelectSavedItem = (savedNode) => {
    actions.navigateSavedForLaterCards(savedNode);
  };

  const renderItem = ({item: edge}) => (
    <SavedForLaterListItem
      savedForLater={edge.node}
      onPress={() => handleSelectSavedItem(edge.node)}
    />
  );

  const renderFooter = () => (
    <FooterIndicator isLoading={isLoadingNext} />
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={viewerData.savedForLater?.edges?.length > 0 ? {} : styles.contentContainer}
      data={viewerData.savedForLater?.edges || []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onRefresh={handleRefetch}
      refreshing={false}
      ListEmptyComponent={<NoResult />}
      onEndReachedThreshold={0.2}
      onEndReached={handleEndReached}
    />
  );
};

export default SavedForLaterList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
