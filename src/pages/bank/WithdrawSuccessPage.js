import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
} from 'react-native';

import {
  Button,
} from 'components';

import ActionContext, {
  useActions,
} from 'actions';
import {Colors, Fonts, createUseStyle} from 'theme';
import {getPrice} from 'utils';

const successConfirmIcon = require('assets/icons/more/success_confirm.png');

const WithdrawSuccessPage = ({
  navigation,
  route,
}) => {
  const {
    amount = 0,
  } = route.params || {};

  const styles = useStyle();
  const actions = useActions();

  useEffect(() => {
    setNavigationBar();
  }, []);

  const setNavigationBar = () => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  };

  const handleViewRedemptionHistory = () => {
    navigation.goBack();
    navigation.navigate('WithdrawHistory');
  };

  return (
    <ActionContext.Provider value={actions}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image style={styles.iconSuccess} source={successConfirmIcon} />
          <Text style={styles.textTitle}>Success!</Text>
          <Text style={styles.textDescription}>
            {`You have withdrawn ${getPrice(amount)} to your bank account. Initial withdrawals may take 7-14 days to arrive in your account.`}
          </Text>
        </View>
        <Button
          style={styles.viewHistoryButton}
          label="View Withdrawal History"
          labelStyle={styles.textViewHistory}
          scale={Button.scaleSize.One}
          onPress={handleViewRedemptionHistory}
        />
      </SafeAreaView>
    </ActionContext.Provider>
  );
}

export default WithdrawSuccessPage;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  iconSuccess: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.primaryText,
    letterSpacing: 0.35,
    textAlign: 'center',
    marginTop: 20,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginTop: 12,
  },
  viewHistoryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  textViewHistory: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));
