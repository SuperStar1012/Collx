import React, {useState, useCallback, Suspense, useEffect} from 'react';
import {View} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import CollectionContent from './CollectionContent';

import {createUseStyle} from 'theme';
import {Constants} from 'globals';
import {getStorageItem} from 'utils';
import {withCollection} from 'store/containers';

const CollectionPage = (props) => {
  const {
    route,
    isEnabledPreserveSettings,
  } = props;

  const styles = useStyle();

  const [queryOptions, setQueryOptions] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null);

  const profileId = route.params?.profileId;

  useEffect(() => {
    if (profileId) {
      return;
    }

    if (isEnabledPreserveSettings) {
      // gets preserve settings for current user
      getStorageItem(Constants.collectionSettings).then(preserveSettings => {
        if (!preserveSettings) {
          return;
        }

        setInitialSettings(preserveSettings);
      });
    } else {
      setInitialSettings(null);
    }
  }, [isEnabledPreserveSettings]);

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
          {profileId ? (
            <OtherCollection
              {...props}
              profileId={profileId}
              queryOptions={queryOptions}
            />
          ) : (
            <MyCollection
              {...props}
              initialSettings={initialSettings}
              queryOptions={queryOptions}
            />
          )}
        </Suspense>
      </ErrorBoundaryWithRetry>
    </View>
  );
};

const MyCollection = (props) => {
  const {
    queryOptions
  } = props;

  const myCollectionData = useLazyLoadQuery(graphql`
    query CollectionPageMyQuery {
      viewer {
        profile {
          ...CollectionContent_profile
        }
        ...CollectionContent_viewer,
      }
    }`,
    {},
    queryOptions,
  );

  if (!myCollectionData) {
    return null;
  }

  return (
    <CollectionContent
      {...props}
      viewer={myCollectionData.viewer}
      profile={myCollectionData.viewer.profile}
    />
  );
};

const OtherCollection = (props) => {
  const {
    profileId,
    queryOptions
  } = props;

  const viewerData = useLazyLoadQuery(
    graphql`
      query CollectionPageQuery {
        viewer {
          ...CollectionContent_viewer,
        }
      }
    `,
    {},
    queryOptions,
  );

  const otherCollectionData = useLazyLoadQuery(graphql`
    query CollectionPageOtherQuery($profileId: ID!) {
      profile(with: {id: $profileId}) {
        ...CollectionContent_profile
      }
    }`,
    {
      profileId,
    },
    queryOptions,
  );

  if (!otherCollectionData) {
    return null;
  }

  return (
    <CollectionContent
      {...props}
      viewer={viewerData.viewer}
      profile={otherCollectionData.profile}
    />
  );
};

export default withCollection(CollectionPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));
