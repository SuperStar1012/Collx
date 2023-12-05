import React, {Suspense, useEffect, useState, useCallback, useMemo} from 'react';
import {View, Text} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  NavBarButton,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import AccountTypeSwitch, {bankAccountType} from './components/AccountTypeSwitch';
import AccountHolder from './components/AccountHolder';
import ConnectedAccountError from './components/ConnectedAccountError';

import {createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withBankAccount} from 'store/containers';
import {usePrevious} from 'hooks';
import {showErrorAlert} from 'utils';

const EditConnectedAccountInfoPage = (props) => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
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

const Content = ({
  navigation,
  route,
  isFetchingAccount,
  connectedAccount,
  bankAccounts,
  errorText,
  getConnectedAccount,
}) => {
  const {isEditBankAccount} = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  const prevProps = usePrevious({
    isFetchingAccount,
  });

  const viewerData = useLazyLoadQuery(graphql`
    query EditConnectedAccountInfoPageQuery {
      viewer {
        buyerSettings {
          stripeConnectedAccountId
        }
      }
    }`,
    {},
    {},
  );

  if (!viewerData) {
    return null;
  }

  const accountHolderType = useMemo(() => {
    if (!connectedAccount) {
      return null;
    }

    return connectedAccount?.business_type;
  }, [connectedAccount]);

  const initialAccountName = useMemo(() => {
    if (!connectedAccount) {
      return null;
    }

    if (connectedAccount.business_type === bankAccountType.company) {
      return ({
        companyName: connectedAccount.company?.name,
      });
    } else if (connectedAccount.business_type === bankAccountType.individual) {
      return ({
        firstName: connectedAccount.individual?.first_name,
        lastName: connectedAccount.individual?.last_name,
      });
    }
  }, [connectedAccount]);

  const [isUpdatingConnectedAccount, setIsUpdatingConnectedAccount] = useState(false);

  const [currentAccountType, setCurrentAccountType] = useState(accountHolderType || bankAccountType.individual);
  const [accountName, setAccountName] = useState(initialAccountName || {});

  const {stripeConnectedAccountId} = viewerData.viewer.buyerSettings || {};

  useEffect(() => {
    setNavigationBar();
  }, [
    isEditBankAccount,
    stripeConnectedAccountId,
    accountName,
    currentAccountType,
  ]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (prevProps.isFetchingAccount && !isFetchingAccount) {
      if (errorText) {
        showErrorAlert(errorText)
        return;
      }

      handleGoBack();
    }
  }, [
    isFetchingAccount,
    bankAccounts,
    errorText,
  ]);

  const setNavigationBar = () => {
    const isDisabledSave = !getAccountName() || !currentAccountType;

    navigation.setOptions({
      headerLeft: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Cancel"
          onPress={handleGoBack}
        />
      ),
      headerRight: () => (
        <NavBarButton
          style={styles.navBarButton}
          label="Save"
          disabled={isDisabledSave}
          onPress={handleSave}
        />
      ),
    });
  };

  const getAccountName = () => {
    if (currentAccountType === bankAccountType.individual && accountName.firstName && accountName.lastName) {
      return `${accountName.firstName} ${accountName.lastName}`.trim();
    } else if (currentAccountType === bankAccountType.company && accountName.companyName) {
      return accountName.companyName.trim();
    }

    return null;
  };

  const updateConnectedAccount = () => {
    setIsUpdatingConnectedAccount(true);

    actions.updateStripeConnectedAccount(
      {
        [currentAccountType]: accountName,
      },
      {
        onComplete: () => {
          setIsUpdatingConnectedAccount(false);

          getConnectedAccount(stripeConnectedAccountId);
        },
        onError: (error) => {
          setIsUpdatingConnectedAccount(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    updateConnectedAccount();
  };

  const handleChangeAccountType = (accountType) => {
    setCurrentAccountType(accountType);
    setAccountName({});
  };

  const handleChangeAccountName = (newName) => {
    setAccountName(newName);
  };

  return (
    <KeyboardAvoidingScrollView style={styles.container}>
      <LoadingIndicator
        isLoading={isUpdatingConnectedAccount || isFetchingAccount}
      />
      <View style={styles.contentContainer}>
        <AccountTypeSwitch
          accountType={currentAccountType}
          accountHolderType={accountHolderType}
          isEditable={true}
          onChangeAccountType={handleChangeAccountType}
        />
        <AccountHolder
          accountType={currentAccountType}
          accountHolderName={null}
          accountName={accountName}
          isEditable={true}
          onChangeAccountName={handleChangeAccountName}
        />
        <Text style={styles.textNote}>
          Please note changing the account type and name will affect all your linked accounts.
        </Text>
      </View>
      <ConnectedAccountError connectedAccount={connectedAccount} />
    </KeyboardAvoidingScrollView>
  );
};

export default withBankAccount(EditConnectedAccountInfoPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
  },
  textNote: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
  },
}));
