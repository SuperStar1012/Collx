import {connect} from 'react-redux';

import {collection, filter, stripe, emailVerification} from '../stores';

const mapStateToProps = state => ({
  isFetchingPaymentMethod: state.stripe.isFetchingPaymentMethod,
  errorText: state.stripe.errorText,
  paymentMethods: state.stripe.paymentMethods,
  otherPaymentMethods: state.stripe.otherPaymentMethods,
});

const mapDispatchToProps = {
  getPaymentMethod: stripe.actions.getPaymentMethod,
  setSort: filter.actions.setSort,
  setFilter: filter.actions.setFilter,
  updateUserCardsCount: collection.actions.updateUserCardsCount,
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
};

export default connect(mapStateToProps, mapDispatchToProps);
