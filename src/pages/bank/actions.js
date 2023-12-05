import {StackActions} from '@react-navigation/native';

export default ({navigation}) => ({
  navigateMyMoney() {
    navigation.navigate('MyMoney');
  },

  navigateVerifyBankAccount(bankAccount) {
    navigation.dispatch(StackActions.replace('VerifyBankAccount', {
      bankAccount,
    }));
  },

  navigateConfirmRedeem() {
    navigation.navigate('ConfirmRedeem');
  },

  navigateRedeemAmount(params) {
    navigation.navigate('RedeemAmount', params);
  },

  navigateLinkBankAccount(params) {
    navigation.navigate('LinkBankAccount', params);
  },

  navigateEditConnectedAccountInfo() {
    navigation.navigate('EditConnectedAccountInfo');
  },

  navigateSelectBankAccount(params) {
    navigation.navigate('SelectBankAccount', params);
  },

  navigateWithdrawSuccess(amount) {
    navigation.dispatch(StackActions.replace('WithdrawSuccess', {
      amount,
    }));
  },

});
