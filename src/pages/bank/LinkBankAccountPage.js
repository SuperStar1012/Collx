import React, {Suspense, useEffect, useState, useCallback, useMemo} from 'react';
import {View, Text, TextInput, Alert} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  Button,
  LoadingIndicator,
  NavBarButton,
  KeyboardAvoidingScrollView,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import AccountTypeSwitch, {bankAccountType} from './components/AccountTypeSwitch';
import AccountHolder from './components/AccountHolder';

import {SchemaTypes, Urls} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withBankAccount} from 'store/containers';
import {usePrevious} from 'hooks';
import {contactSupport, openUrl, showErrorAlert} from 'utils';

const errorMessages = {
  'errored': 'An error occurred linking this account. Please remove this account and add a new one.',
  'verification_failed': 'An error occurred verifying this account. Please remove this account and add a new one.',
};

const LinkBankAccountPage = (props) => {
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
  isCreatingBankAccount,
  isUpdatingBankAccount,
  isDeletingBankAccount,
  connectedAccount,
  bankAccounts,
  errorText,
  createBankAccount,
  deleteBankAccount,
}) => {
  const {bankAccount} = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  const prevProps = usePrevious({
    isCreatingBankAccount,
    isUpdatingBankAccount,
    isDeletingBankAccount,
  });

  const viewerData = useLazyLoadQuery(graphql`
    query LinkBankAccountPageQuery {
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

  const accountHolderName = useMemo(() => {
    if (!connectedAccount) {
      return null;
    }

    if (connectedAccount.business_type === bankAccountType.company) {
      return connectedAccount.company?.name;
    } else if (connectedAccount.business_type === bankAccountType.individual) {
      return `${connectedAccount.individual?.first_name} ${connectedAccount.individual?.last_name}`.trim();
    }
  }, [connectedAccount]);

  const isErroredBankAccount = useMemo(() => {
    if (!bankAccount) {
      return false;
    }

    return bankAccount.status === 'verification_failed' || bankAccount.status === 'errored';
  }, [bankAccount]);

  const [isCreatingConnectedAccount, setIsCreatingConnectedAccount] = useState(false);

  const [currentAccountType, setCurrentAccountType] = useState(accountHolderType || bankAccountType.individual);
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState({});

  const {stripeConnectedAccountId} = viewerData.viewer.buyerSettings || {};

  useEffect(() => {
    setNavigationBar();
  }, [
    stripeConnectedAccountId,
    routingNumber,
    accountNumber,
    accountName,
    currentAccountType,
  ]);

  useEffect(() => {
    if (!prevProps) {
      return;
    }

    if (
      (prevProps.isCreatingBankAccount && !isCreatingBankAccount) ||
      (prevProps.isUpdatingBankAccount && !isUpdatingBankAccount) ||
      (prevProps.isDeletingBankAccount && !isDeletingBankAccount)
    ) {
      if (errorText) {
        showErrorAlert(errorText)
        return;
      }

      handleGoBack();
    }
  }, [
    isCreatingBankAccount,
    isUpdatingBankAccount,
    bankAccounts,
    errorText,
  ]);

  const setNavigationBar = () => {
    if (bankAccount) {
      // For View Account Detail
      navigation.setOptions({
        title: 'Bank Account Detail',
      });
      return;
    }

    const isDisabledSave = !routingNumber || !accountNumber || !getAccountName() || !currentAccountType;

    navigation.setOptions({
      title: 'Link Bank Account',
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

    return accountHolderName;
  };

  const createConnectedAccount = () => {
    // creates new account
    setIsCreatingConnectedAccount(true);

    actions.createStripeConnectedAccount(
      {
        [currentAccountType]: accountName,
      },
      {
        onComplete: (buyerSettings) => {
          setIsCreatingConnectedAccount(false);

          if (buyerSettings?.stripeConnectedAccountId) {
            handleCreateBankAccount(buyerSettings?.stripeConnectedAccountId);
          }
        },
        onError: (error) => {
          setIsCreatingConnectedAccount(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleCreateBankAccount = (connectedAccountId) => {
    // Creates bank account
    createBankAccount({
      stripeConnectedAccountId: connectedAccountId,
      externalAccount: {
        country: 'US',
        currency: SchemaTypes.currencyCode.USD.toLowerCase(),
        account_number: accountNumber,
        routing_number: routingNumber,
        account_holder_name: getAccountName(),
        account_holder_type: currentAccountType,
      },
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    contactSupport();
  };

  const handleSave = () => {
    if (stripeConnectedAccountId) {
      handleCreateBankAccount(stripeConnectedAccountId);
      return;
    }

    Alert.alert(
      'Please Confirm',
      'By registering your account, you agree to our Services Agreement and the Stripe Connected Account Agreement.',
      [
        {
          text: 'View terms',
          onPress: () => {
            openUrl(Urls.stripeConnectedAccountAgreementUrl);
          },
        },
        {
          text: 'I agree',
          isPreferred: true,
          onPress: () => {
            createConnectedAccount();
          },
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const handleDeleteBankAccount = () => {
    if (!stripeConnectedAccountId || !bankAccount?.id) {
      return;
    }

    deleteBankAccount({
      stripeConnectedAccountId,
      bankAccountId: bankAccount.id,
    });
  };

  const handleChangeRoutingNumber = (value) => {
    setRoutingNumber(value);
  };

  const handleChangeAccountNumber = (value) => {
    setAccountNumber(value);
  };

  const handleChangeAccountType = (accountType) => {
    setCurrentAccountType(accountType);
    setAccountName({});
  };

  const handleChangeAccountName = (newName) => {
    setAccountName(newName);
  };

  const renderRoutingNumber = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.textSectionTitle}>
        Routing Number
      </Text>
      {bankAccount ? (
        <Text style={styles.textValue}>{bankAccount.routing_number}</Text>
      ) : (
        <TextInput
          style={styles.textInputValue}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          placeholder="Routing Number"
          keyboardType="numeric"
          maxLength={9}
          value={routingNumber}
          onChangeText={handleChangeRoutingNumber}
        />
      )}
    </View>
  );

  const renderAccountNumber = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.textSectionTitle}>
        Account Number
      </Text>
      {bankAccount ? (
        <Text style={styles.textValue}>{`•••• ${bankAccount.last4}`}</Text>
      ) : (
        <TextInput
          style={styles.textInputValue}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          placeholder="Account Number"
          keyboardType="numeric"
          maxLength={17}
          value={accountNumber}
          onChangeText={handleChangeAccountNumber}
        />
      )}
    </View>
  );

  const renderError = () => {
    if (!isErroredBankAccount) {
      return null;
    }

    return (
      <Text style={styles.textErrors}>
        {`${errorMessages[bankAccount.status]}  `}
        <Text
          style={styles.textContactSupport}
          onPress={handleContactSupport}
        >
          Contact Support
        </Text>
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView>
        <LoadingIndicator
          isLoading={isCreatingConnectedAccount || isCreatingBankAccount || isUpdatingBankAccount || isDeletingBankAccount}
        />
        <AccountTypeSwitch
          accountType={currentAccountType}
          accountHolderType={accountHolderType}
          onChangeAccountType={handleChangeAccountType}
        />
        <AccountHolder
          accountType={currentAccountType}
          accountHolderName={accountHolderName}
          accountName={accountName}
          onChangeAccountName={handleChangeAccountName}
        />
        {renderRoutingNumber()}
        {renderAccountNumber()}
        {renderError()}
      </KeyboardAvoidingScrollView>
      {isErroredBankAccount ? (
        <Button
          style={styles.deleteButton}
          label="Delete Bank Account"
          labelStyle={styles.textDeleteButton}
          scale={Button.scaleSize.One}
          onPress={handleDeleteBankAccount}
        />
      ) : null}
    </View>
  );
};

export default withBankAccount(LinkBankAccountPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  navBarButton: {
    minWidth: 70,
    paddingHorizontal: 10,
  },
  sectionContainer: {
    marginTop: 20,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  textInputValue: {
    height: 40,
    borderRadius: 2,
    color: colors.primaryText,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.secondaryCardBackground,
  },
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  textErrors: {
    marginHorizontal: 16,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.red,
  },
  textContactSupport: {
    color: colors.primary,
  },
  deleteButton: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    borderColor: Colors.red,
  },
  textDeleteButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: Colors.red,
  },
}));
