import React, {Suspense, useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  Switch,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';

import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';

const AcceptOffersPage = (props) => {
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
            />
          </Suspense>
        </ErrorBoundaryWithRetry>
      </View>
    </ActionContext.Provider>
  );
};

const Content = (props) => {
  const {queryOptions} = props;

  const styles = useStyle();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query AcceptOffersPageQuery {
      viewer {
        sellerSettings {
          id
          acceptOffer
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const sellerSettings = viewerData?.viewer?.sellerSettings || {};

  const [isAcceptOffer, setIsAcceptOffer] = useState(sellerSettings?.acceptOffer);

  const handleChangeValue = (value) => {
    setIsAcceptOffer(value);
    actions.setSellerAcceptOffer(value);
  };

  return (
    <View style={styles.container}>
      <Switch
        style={styles.switchContainer}
        label="Accept Offers"
        value={isAcceptOffer}
        onChangedValue={handleChangeValue}
      />
      <Text style={styles.textDescription}>
        By toggling this setting on, buyers can submit price offers to your cards as a deal.
      </Text>
      <Text style={styles.textDescription}>
        When you stop accepting offers, buyers can only buy your cards with the set asking price.
      </Text>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  switchContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    margin: 16,
  },
}));

export default AcceptOffersPage;
