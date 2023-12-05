import React, {Suspense, useCallback, useState} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import FeaturedUsersList from './components/FeaturedUsersList';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import {createUseStyle} from 'theme';

const FeaturedUsersPage = props => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
  };

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ErrorBoundaryWithRetry
          onRetry={handleRefresh}
          fallback={({retry}) => <ErrorView onTryAgain={retry} />}
        >
          <Suspense fallback={<LoadingIndicator isLoading />}>
            <Content
              {...props}
              queryOptions={refreshedQueryOptions}
              onRefetch={handleRefresh}
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = (props) => {
  const {
    queryOptions,
  } = props;

  const viewerData = useLazyLoadQuery(graphql`
    query FeaturedUsersPageQuery {
      viewer {
        recommendations {
          ...FeaturedUsersList_recommendations
        }
        ...FollowButton_viewer
      }
    }`,
    {},
    queryOptions
  );

  if (!viewerData) {
    return null;
  }

  return (
    <FeaturedUsersList
      {...props}
      viewer={viewerData.viewer}
      recommendations={viewerData.viewer.recommendations}
    />
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default FeaturedUsersPage;
