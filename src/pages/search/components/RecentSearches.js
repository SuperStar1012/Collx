import React, {Suspense, useState, useCallback} from 'react';
import {
  View,
  Text,
  Alert,
} from 'react-native';
import {graphql, useLazyLoadQuery, useFragment} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
  Button,
  KeyboardAvoidingFlatList,
} from 'components';
import RecentSearchItem from './RecentSearchItem';
import NoRecentSearch from './NoRecentSearch';

import {Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from '../actions';
import {
  showErrorAlert,
} from 'utils';

const RecentSearches = (props) => {
  const styles = useStyle();
  const {navigation} = props;

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
    refresh: handleRefresh,
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <MainContent
              {...props}
              queryOptions={refreshedQueryOptions ?? {}}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const MainContent = (props) => {
  const {
    queryOptions,
  } = props;

  const viewerData = useLazyLoadQuery(graphql`
    query RecentSearchesQuery {
      viewer {
        ...RecentSearches_viewer
      }
    }`,
    {},
    queryOptions,
  );

  return (
    <Content
      {...props}
      viewer={viewerData.viewer}
    />
  );
};

const Content = ({
  viewer,
  onSelectSearch,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const [isDeletingSavedSearches, setIsDeletingSavedSearches] = useState(false);

  const savedSearchesData = useFragment(graphql`
    fragment RecentSearches_viewer on Viewer {
      savedSearches(first: 10)
      @connection(key: "RecentSearches_viewer__savedSearches") {
        edges {
          node {
            id
            query
          }
        }
      }
    }`,
    viewer
  );

  const {savedSearches} = savedSearchesData || {};

  if (!savedSearches) {
    return null;
  }

  const deleteSavedSearch = (ids, isDeleteAll) => {
    setIsDeletingSavedSearches(true);

    actions.deleteSavedSearch(
      ids,
      isDeleteAll,
      {
        onComplete: () => {
          setIsDeletingSavedSearches(false);
        },
        onError: (error) => {
          setIsDeletingSavedSearches(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleClearRecent = item => {
    if (!item.id) {
      return;
    }

    deleteSavedSearch([item.id]);
  };

  const handleClearRecentAll = () => {
    const savedSearchIds = savedSearches.edges?.map(item => item.node.id) || [];
    deleteSavedSearch(savedSearchIds, true);
  };

  const handleSelect = item => {
    if (onSelectSearch) {
      onSelectSearch(item);
    }
  };

  const handleClearRecentSearches = () => {
    Alert.alert('CollX', 'Are you sure you want to clear recent searches?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: handleClearRecentAll,
      },
    ]);
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const renderItem = ({item: {node}}) => (
    <RecentSearchItem
      label={node.query}
      onPress={() => handleSelect(node)}
      onClearRecent={() => handleClearRecent(node)}
    />
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isDeletingSavedSearches} />
      {savedSearches?.edges?.length > 0 ? (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.textSectionHeaderTitle}>
            Recent Searches
          </Text>
          <Button
            label="Clear All"
            labelStyle={styles.textClearAll}
            scale={Button.scaleSize.Two}
            onPress={handleClearRecentSearches}
          />
        </View>
      ) : null}
      <KeyboardAvoidingFlatList
        contentContainerStyle={styles.listContentContainer}
        data={savedSearches.edges || []}
        renderItem={renderItem}
        refreshing={false}
        isInitialKeyboard
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleRefresh}
        ListEmptyComponent={<NoRecentSearch />}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.quaternaryBorder,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  textSectionHeaderTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.darkGrayText,
  },
  textClearAll: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  listContentContainer: {
    flexGrow: 1,
  },
}));

export default RecentSearches;
