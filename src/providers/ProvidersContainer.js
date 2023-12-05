/* eslint-disable no-undef */
import React, {useState, useCallback, useMemo, Suspense} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {graphql, useLazyLoadQuery, useSubscription} from 'react-relay';

import {
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import ActionContext, {
  useActions,
  createNavigationActions,
  createSharingActions,
} from 'actions';
import {withProviders} from 'store/containers';
import {createUseStyle} from 'theme';

import PushNotificationProvider from './PushNotificationProvider';
import UserProvider from './UserProvider';
import MessageProvider from './MessageProvider';
import MaintenanceProvider from './MaintenanceProvider';
import NetworkProvider from './NetworkProvider';
import ToastProvider from './ToastProvider';

const ProvidersContainer = ({user}) => {
  const navigation = useNavigation();

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

  const handleRefresh = useCallback(() => {
    setRefreshedQueryOptions(prev => ({
      fetchKey: (prev?.fetchKey ?? 0) + 1,
      fetchPolicy: 'network-only',
    }));
  }, []);

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createSharingActions(),
    refresh: handleRefresh,
  };

  if (!user || !user.id || user.anonymous) {
    return null;
  }

  return (
    <ActionContext.Provider value={actions}>
      <ErrorBoundaryWithRetry
        onRetry={handleRefresh}
        fallback={({retry}) => <ErrorView style={styles.container} onTryAgain={retry} />}>
        <Suspense fallback={<View />}>
          <Content
            queryOptions={refreshedQueryOptions}
          />
        </Suspense>
      </ErrorBoundaryWithRetry>
    </ActionContext.Provider>
  );
};

const Content = ({
  queryOptions,
}) => {

  const viewerData = useLazyLoadQuery(graphql`
    query ProvidersContainerQuery {
      viewer {
        profile {
          id
          ...UserProvider_profile
          ...MessageProvider_profile
        }
        ...PushNotificationProvider_viewer
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const {id: profileId} = viewerData?.viewer?.profile || {};

  if (!profileId) {
    return null;
  }

  const subscriptionConfig = useMemo(() => ({
    variables: {profileId},
    subscription: graphql`
      subscription ProvidersContainerSubscription($profileId: ID!) {
        profileChanged(id: $profileId) {
          status
          emailStatus
          flags
          viewer {
            isMyEmailVerified
          }
        }
      }`
    ,
    onError: (error) => {
      console.log(error);
    },
  }), [profileId]);

  useSubscription(subscriptionConfig);

  return (
    <>
      <PushNotificationProvider viewer={viewerData.viewer} />
      <UserProvider profile={viewerData.viewer?.profile} />
      <MessageProvider profile={viewerData.viewer?.profile} />
      <MaintenanceProvider />
      <NetworkProvider />
      <ToastProvider />
    </>
  );
};

export default withProviders(ProvidersContainer);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
}));
