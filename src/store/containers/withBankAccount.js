import {connect} from 'react-redux';

import {stripe} from '../stores';

const mapStateToProps = state => ({
  isFetchingAccount: state.stripe.isFetchingAccount,
  isUpdatingAccount: state.stripe.isUpdatingAccount,
  isFetchingBankAccounts: state.stripe.isFetchingBankAccounts,
  isCreatingBankAccount: state.stripe.isCreatingBankAccount,
  isUpdatingBankAccount: state.stripe.isUpdatingBankAccount,
  isDeletingBankAccount: state.stripe.isDeletingBankAccount,
  errorText: state.stripe.errorText,
  connectedAccount: state.stripe.account,
  bankAccounts: state.stripe.bankAccounts,
});

const mapDispatchToProps = {
  getConnectedAccount: stripe.actions.getAccount,
  updateConnectedAccount: stripe.actions.updateAccount,
  getBankAccounts: stripe.actions.getBankAccounts,
  createBankAccount: stripe.actions.createBankAccount,
  deleteBankAccount: stripe.actions.deleteBankAccount,
  updateBankAccount: stripe.actions.updateBankAccount,
};

export default connect(mapStateToProps, mapDispatchToProps);
