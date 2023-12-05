import React, {useState, useCallback, Suspense} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import ViewFullSetContent from './ViewFullSetContent';

import {createUseStyle} from 'theme';

const ViewFullSetPage = (props) => {
  const {route} = props;

  const styles = useStyle();

  const {profileId, setId} = route.params || {};

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
    <View style={styles.container}>
      <ErrorBoundaryWithRetry
        onRetry={handleRefresh}
        fallback={({retry}) => <ErrorView onTryAgain={retry} />}>
        <Suspense fallback={<LoadingIndicator isLoading />}>
          {profileId ? (
            <OtherViewFullSet
              {...props}
              profileId={profileId}
              setId={setId}
              queryOptions={refreshedQueryOptions}
              onRefetch={handleRefresh}
              />
          ) : (
            <MyViewFullSet
              {...props}
              setId={setId}
              queryOptions={refreshedQueryOptions}
              onRefetch={handleRefresh}
            />
          )}
        </Suspense>
      </ErrorBoundaryWithRetry>
    </View>
  );
};

const MyViewFullSet = (props) => {
  const mySetData = useLazyLoadQuery(graphql`
    query ViewFullSetPageMyQuery($setId: ID!) {
      set(with: {id: $setId}) {
        id
        name
        numberOfCards
        viewer {
          numberOfCards
        }
      }
    }`,
    {setId: props.setId},
    props.queryOptions
  );

  if (!mySetData) {
    return null;
  }

  return (
    <ViewFullSetContent
      {...props}
      setId={props.setId}
      set={mySetData.set}
    />
  );
};

const OtherViewFullSet = (props) => {
  const otherSetData = useLazyLoadQuery(graphql`
    query ViewFullSetPageOtherQuery($setId: ID!, $profileId: ID!) {
      set(with: {id: $setId}) {
        id
        name
        numberOfCards
        viewer (asProfile: $profileId) {
          numberOfCards
        }
      }
    }`,
    {
      setId: props.setId,
      profileId: props.profileId
    },
    props.queryOptions
  );

  if (!otherSetData) {
    return null;
  }

  return (
    <ViewFullSetContent
      {...props}
      profileId={props.profileId}
      setId={props.setId}
      set={otherSetData.set}
    />
  );
};

export default ViewFullSetPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
