import React, {Suspense, useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {View, FlatList} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  LoadingIndicator,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import BankAccountItem from './components/BankAccountItem';
import ConnectedAccountItem from './components/ConnectedAccountItem';

import {createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import {withBankAccount} from 'store/containers';
import createActions from './actions';

const bankAccountActionIds = {
  set_as_default: 'Set as Default',
  delete_bank_account: 'Delete Bank Account',
  view_account_detail: 'View Account Detail',
  cancel: 'Cancel'
};

const accountActionIds = {
  link: 'Link',
  edit: 'Edit',
};

const linkBankAccountAction = {
  actionId: accountActionIds.link,
  label: 'Link Bank Account',
  icon: require('assets/icons/bank.png'),
};

const editAccountAction = {
  actionId: accountActionIds.edit,
  label: 'Edit Account Name and Type',
  icon: require('assets/icons/pencil.png'),
};

const SelectBankAccountPage = (props) => {
  const {
    navigation,
  } = props;

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
    handleRefresh,
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

const Content = (props) => {
  const {
    navigation,
    route,
    queryOptions,
    isFetchingBankAccounts,
    isUpdatingBankAccount,
    isDeletingBankAccount,
    connectedAccount,
    bankAccounts,
    getBankAccounts,
    updateBankAccount,
    deleteBankAccount,
  } = props;

  const {onSelectBank} = route.params || {};

  const insets = useSafeAreaInsets();

  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const viewerData = useLazyLoadQuery(graphql`
    query SelectBankAccountPageQuery {
      viewer {
        buyerSettings {
          stripeConnectedAccountId
        }
      }
    }`,
    {},
    queryOptions,
  );

  if (!viewerData) {
    return null;
  }

  const actionSheetRef = useRef(null);
  const currentBankAccount = useRef(null);
  const [currentBankAccountActions, setCurrentBankAccountActions] = useState([]);

  const {stripeConnectedAccountId} = viewerData.viewer?.buyerSettings || {};

  const connectedAccountActions = useMemo(() => {
    const actions = [linkBankAccountAction];

    if (bankAccounts?.length) {
      const editAction = {
        ...editAccountAction,
        isAccountError: connectedAccount?.requirements?.disabled_reason,
      };

      actions.push(editAction);
    }

    return actions;
  }, [connectedAccount, bankAccounts]);

  useEffect(() => {
    if (!stripeConnectedAccountId) {
      return;
    }

    getBankAccounts(stripeConnectedAccountId);
  }, [stripeConnectedAccountId]);

  const handleRefresh = () => {
    actions.handleRefresh();

    getBankAccounts(stripeConnectedAccountId);
  };

  const handleChangeBank = bank => {
    if (onSelectBank) {
      onSelectBank(bank);
      navigation.goBack();
    }
  };

  const handleAccount = (actionId) => {
    switch (actionId) {
      case accountActionIds.link:
        actions.navigateLinkBankAccount();
        break;
      case accountActionIds.edit:
        actions.navigateEditConnectedAccountInfo();
        break;
    }
  };

  const handleActionMore = (bank) => {
    currentBankAccount.current = bank;

    let actions = [];

    if (bank.default_for_currency) {
      // Default Bank
      actions = [
        bankAccountActionIds.view_account_detail,
        bankAccountActionIds.cancel,
      ];
    } else {
      // Normal Bank
      actions = [
        bankAccountActionIds.set_as_default,
        bankAccountActionIds.delete_bank_account,
        bankAccountActionIds.view_account_detail,
        bankAccountActionIds.cancel,
      ];
    }

    setCurrentBankAccountActions(actions);

    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleSetDefaultBank = bank => {
    if (!stripeConnectedAccountId || !bank?.id) {
      return;
    }

    updateBankAccount({
      stripeConnectedAccountId,
      bankAccountId: bank?.id,
      externalAccount: {
        default_for_currency: true,
      },
    });
  };

  const handleDeleteBankAccount = (bank) => {
    if (!stripeConnectedAccountId || !bank?.id) {
      return;
    }

    deleteBankAccount({
      stripeConnectedAccountId,
      bankAccountId: bank.id,
    });
  };

  const handleSelectAction = async index => {
    if (!currentBankAccount.current) {
      return;
    }

    const action = currentBankAccountActions[index];

    switch (action) {
      case bankAccountActionIds.set_as_default: {
        // Set as Default
        handleSetDefaultBank(currentBankAccount.current);
        break;
      }
      case bankAccountActionIds.view_account_detail: {
        // View Account Detail
        actions.navigateLinkBankAccount({
          bankAccount: currentBankAccount.current,
        });
        break;
      }
      case bankAccountActionIds.delete_bank_account: {
        // Delete Bank Bank
        handleDeleteBankAccount(currentBankAccount.current);
        break;
      }
    }

    currentBankAccount.current = null;
  };

  const renderItem = ({item}) => (
    <BankAccountItem
      bank={item}
      disabled={!onSelectBank}
      onSelect={handleChangeBank}
      onEdit={handleActionMore}
    />
  );

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <View style={styles.container}>
          <LoadingIndicator isLoading={isFetchingBankAccounts || isUpdatingBankAccount || isDeletingBankAccount} />
          <FlatList
            style={styles.sectionContainer}
            data={bankAccounts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshing={false}
            onRefresh={handleRefresh}
          />
          <View style={[styles.actionsContainer, !tabBarHeight && {marginBottom: insets.bottom || 20}]}>
            {connectedAccountActions.map((item, index) => (
              <ConnectedAccountItem
                key={index}
                {...item}
                onPress={handleAccount}
              />
            ))}
          </View>
          <ActionSheet
            ref={actionSheetRef}
            tintColor={colors.primaryText}
            options={currentBankAccountActions || []}
            destructiveButtonIndex={
              currentBankAccount.current?.default_for_currency ?  -1 : currentBankAccountActions.length - 3
            }
            cancelButtonIndex={currentBankAccountActions.length - 1}
            onPress={handleSelectAction}
          />
        </View>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  sectionContainer: {
    flexGrow: 0,
  },
  actionsContainer: {
    marginVertical: 20,
  },
}));

export default withBankAccount(SelectBankAccountPage);
