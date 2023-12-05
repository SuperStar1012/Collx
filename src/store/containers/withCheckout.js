import {connect} from 'react-redux';

import {emailVerification, stripe} from '../stores';

const mapStateToProps = state => ({
  isFetchingPaymentMethod: state.stripe.isFetchingPaymentMethod,
  errorText: state.stripe.errorText,
  paymentMethods: state.stripe.paymentMethods,
  otherPaymentMethods: state.stripe.otherPaymentMethods,
});

const mapDispatchToProps = {
  getPaymentMethod: stripe.actions.getPaymentMethod,
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
};

export default connect(mapStateToProps, mapDispatchToProps);
