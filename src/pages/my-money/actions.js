export default ({navigation}) => ({
  navigateRedemptionHistory() {
    navigation.navigate('WithdrawHistory');
  },

  navigateVerifyBankAccount(bankAccount) {
    navigation.navigate('VerifyBankAccount', {
      bankAccount,
    });
  },

});
