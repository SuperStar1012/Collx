import React, {Suspense, useState, useCallback} from 'react';
import {View, Text, ScrollView, RefreshControl} from 'react-native';
import {graphql, useLazyLoadQuery} from 'react-relay';

import {
  LoadingIndicator,
  Button,
  ErrorBoundaryWithRetry,
  ErrorView,
} from 'components';
import ConfirmRedeemItem from './components/ConfirmRedeemItem';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {withBankAccount} from 'store/containers';
import {showErrorAlert, getPrice, getFixedPrice} from 'utils';

const ConfirmRedeemPage = (props) => {
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

const Content = ({
  bankAccounts,
}) => {
  const styles = useStyle();
  const actions = useActions();
  const {t: {colors}} = useTheme();

  const [isUpdating, setIsUpdating] = useState(false);

  const viewerData = useLazyLoadQuery(graphql`
    query ConfirmRedeemPageQuery {
      viewer {
        myMoney {
          settled {
            balance {
              formattedAmount
            }
          }
        }
      }
    }`,
    {},
    {},
  );

  if (!viewerData) {
    return null;
  }

  const {formattedAmount} = viewerData.viewer.myMoney?.settled?.balance || {};

  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentBankAccount, setCurrentBankAccount] = useState(bankAccounts[0]);

  // useEffect(() => {
  //   setCurrentPrice(amount);
  // }, [amount]);

  const handleWithdrawSuccess = () => {
    actions.navigateWithdrawSuccess(currentPrice);
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const handleWithdraw = () => {
    if (!currentBankAccount?.id || !Number(currentPrice)) {
      return;
    }

    setIsUpdating(true);

    actions.withdrawMoney(
      currentBankAccount.id,
      Number(currentPrice),
      {
        onComplete: () => {
          setIsUpdating(false);
          handleWithdrawSuccess();
        },
        onError: (error) => {
          console.log(error);
          setIsUpdating(false);

          if (error?.message) {
            showErrorAlert(error?.message);
          }
        },
      },
    );
  };

  const handleEditAmount = () => {
    actions.navigateRedeemAmount({
      initialPrice: getFixedPrice(Number(currentPrice)),
      onDidChange: setCurrentPrice,
    });
  };

  const handleEditRedemptionMethod = () => {
    actions.navigateSelectBankAccount({
      onSelectBank: setCurrentBankAccount,
    });
  };

  const renderBankAccount = () => {
    if (!currentBankAccount) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textSectionTitle}>
          Withdraw Method
        </Text>
        <ConfirmRedeemItem
          id={currentBankAccount.id}
          title="Bank Direct Deposit"
          subtitle1={`${currentBankAccount.bank_name}, ····${currentBankAccount.last4}`}
          subtitle2={currentBankAccount.account_holder_name}
          onEdit={handleEditRedemptionMethod}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoadingIndicator isLoading={isUpdating} />
      <ScrollView
        style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={colors.primary}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={styles.balanceContainer}>
          <View style={styles.availableBalanceContainer}>
            <Text style={styles.texBalanceName}>CollX Available Balance</Text>
            <Text style={[styles.texBalanceName, styles.textAvailableBalance]}>
              {formattedAmount}
            </Text>
          </View>
          <Text style={styles.textBalanceDescription}>
            Your account balance can be applied toward purchases at checkout. You can also withdraw to a connected bank account.
          </Text>
        </View>
        {renderBankAccount()}
        <View style={styles.sectionContainer}>
          <Text style={styles.textSectionTitle}>
            Withdraw Amount
          </Text>
          <ConfirmRedeemItem
            title={getPrice(currentPrice)}
            onEdit={handleEditAmount}
          />
        </View>
      </ScrollView>
      <Text style={styles.textDescription}>
        There is a minimum of $10 to withdraw funds, and a $2 per withdrawal fee charged by our banking partner.
      </Text>
      <Button
        style={styles.withdrawButton}
        label="Withdraw"
        labelStyle={styles.textWithdraw}
        scale={Button.scaleSize.One}
        disabled={!currentBankAccount || !Number(currentPrice)}
        onPress={handleWithdraw}
      />
    </View>
  );
};

export default withBankAccount(ConfirmRedeemPage);

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  mainContainer: {
    flex: 1,
  },
  balanceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryCardBackground,
  },
  availableBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  texBalanceName: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textAvailableBalance: {
    fontWeight: Fonts.semiBold,
  },
  textBalanceDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginTop: 8,
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
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    margin: 16,
    textAlign: 'center',
  },
  withdrawButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  textWithdraw: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    letterSpacing: 0.38,
    color: Colors.white,
  },
}));
