import React, {useState, useCallback, Suspense, useEffect} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import MyLikesContent from './MyLikesContent';

import {createUseStyle, Fonts} from 'theme';

const MyLikesPage = (props) => {

  const styles = useStyle();

  const [queryOptions, setQueryOptions] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null);

  const handleRefresh = useCallback(() => {
    setQueryOptions((prev) => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  return (
    <View style={styles.container}>
      <ErrorBoundaryWithRetry
        onRetry={handleRefresh}
        fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
        <Suspense fallback={<LoadingIndicator isLoading />}>
            <MyLikeCollection
                {...props}
                initialSettings={initialSettings}
                queryOptions={queryOptions}
            />
        </Suspense>
      </ErrorBoundaryWithRetry>
    </View>
  );
};

const MyLikeCollection = (props) => {
  const {
    queryOptions
  } = props;

  const MyLikeCollectionData = useLazyLoadQuery(graphql`
    query MyLikesPageMyQuery {
      viewer {
        profile {
          ...CollectionContent_profile
        }
        ...MyLikesContentMyQuery_viewer
      }
    }`,
    {},
    queryOptions,
  );

  if (!MyLikeCollectionData) {
    return null;
  }

  return (
    <MyLikesContent
      {...props}
      viewer={MyLikeCollectionData.viewer}
    />
  );
};

export default MyLikesPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
