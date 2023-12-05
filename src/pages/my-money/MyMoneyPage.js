import React, {Suspense, useEffect, useMemo, useState, useCallback} from 'react';
import {FlatList, View, ScrollView, RefreshControl} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import MyMoneyItem from './components/MyMoneyItem';
import MyMoneyAmountItem from './components/MyMoneyAmountItem';

import {createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withBankAccount} from 'store/containers';

const myMoneyMainItems = [
  {
    label: 'CollX Credit',
    route: null,
    disabledFormat: true,
  },
  {
    label: 'Pending',
    route: null,
    disabledFormat: true,
  },
  {
    label: 'Balance',
    route: null,
    disabledFormat: false,
  },
];

const myMoneyMoreItems = [
  {
    label: 'Withdraw History',
    route: 'WithdrawHistory',
  },
  {
    label: 'Balance Activity',
    route: 'BalanceActivity',
  },
  {
    label: 'CollX Credit History',
    route: 'CreditHistory',
  },
  {
    label: 'Link Bank Account',
    route: 'SelectBankAccount',
  },
  {
    label: 'Enter CollX Credit Code',
    route: 'EnterCollXCreditCode',
  },
];

const MyMoneyPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState({
    fetchPolicy: 'store-and-network',
  });

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

const Content = props => {
  const {
    navigation,
    queryOptions,
    isFetchingAccount,
    isUpdatingAccount,
    isFetchingBankAccounts,
    connectedAccount,
    bankAccounts,
    getConnectedAccount,
    updateConnectedAccount,
    getBankAccounts,
  } = props;

  const styles = useStyle();
  const {t: {colors}} = useTheme();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query MyMoneyPageQuery {
      viewer {
        myIpAddress
        buyerSettings {
          stripeConnectedAccountId
        }
        myMoney {
          credit {
            ...MyMoneyAmountItem_ledger
          }
          pending {
            ...MyMoneyAmountItem_ledger
          }
          settled {
            ...MyMoneyAmountItem_ledger
          }
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const {stripeConnectedAccountId} = viewerData.viewer.buyerSettings || {};
  const {myMoney, myIpAddress} = viewerData?.viewer || {};

  const myMoneyData = useMemo(() => {
    myMoneyMainItems[0].ledger = myMoney?.credit;
    myMoneyMainItems[1].ledger = myMoney?.pending;
    myMoneyMainItems[2].ledger = myMoney?.settled;

    if (bankAccounts?.length) {
      myMoneyMainItems[2].route = 'ConfirmRedeem';
    }
    return myMoneyMainItems;
  }, [myMoney, bankAccounts]);

  useEffect(() => {
    if (!stripeConnectedAccountId) {
      return;
    }

    getConnectedAccount(stripeConnectedAccountId);
    getBankAccounts(stripeConnectedAccountId);
  }, [stripeConnectedAccountId]);

  useEffect(() => {
    if (!connectedAccount) {
      return;
    }

    if (connectedAccount?.id && connectedAccount?.capabilities?.transfers === 'inactive') {
      updateConnectedAccount({
        stripeConnectedAccountId: connectedAccount.id,
        params: {
          tos_acceptance: {
            date: Math.round(Date.now() / 1000),
            ip: myIpAddress,
          }
        }
      });
    }
  }, [connectedAccount, myIpAddress]);

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleSelect = value => {
    if (value.action) {
      value.action();
    } else if (value.route) {
      navigation.navigate(value.route);
    }
  };

  const renderAmountItem = ({item}) => (
    <MyMoneyAmountItem
      {...item}
      onPress={handleSelect}
    />
  );

  const renderHistoryItem = ({item}) => (
    <MyMoneyItem
      {...item}
      valueStyle={styles.textString}
      onPress={handleSelect}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={false}
          tintColor={colors.primary}
          onRefresh={handleRefresh}
        />
      }
    >
      <LoadingIndicator
        isLoading={isFetchingAccount || isUpdatingAccount || isFetchingBankAccounts}
      />
      <FlatList
        style={styles.listContainer}
        data={myMoneyData}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAmountItem}
      />
      <FlatList
        style={[styles.listContainer, styles.secondListContainer]}
        data={myMoneyMoreItems}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderHistoryItem}
      />
    </ScrollView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  listContainer: {
    flexGrow: 0,
  },
  secondListContainer: {
    marginTop: 20,
  },
  textString: {
    color: colors.grayText,
  },
}));

export default withBankAccount(MyMoneyPage);
