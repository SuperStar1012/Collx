import {connect} from 'react-redux';

import {stripe} from '../stores';

const mapStateToProps = state => ({
  isFetching:
    state.stripe.isUpdatingCustomer ||
    state.stripe.isFetchingPaymentMethods,
  isAttachingPaymentMethod: state.stripe.isAttachingPaymentMethod,
  isDetachingPaymentMethod: state.stripe.isDetachingPaymentMethod,
  errorText: state.stripe.errorText,
  paymentMethods: state.stripe.paymentMethods,
});

const mapDispatchToProps = {
  updateCustomer: stripe.actions.updateCustomer,
  getPaymentMethods: stripe.actions.getPaymentMethods,
  attachPaymentMethod: stripe.actions.attachPaymentMethod,
  detachPaymentMethod: stripe.actions.detachPaymentMethod,
};

export default connect(mapStateToProps, mapDispatchToProps);
