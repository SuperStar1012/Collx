import {connect} from 'react-redux';

import {subscription} from '../stores';

const mapStateToProps = state => ({
  isFetchingOfferings: state.subscription.isFetchingOfferings,
  isPurchasingPackage: state.subscription.isPurchasingPackage,
  isRestoringPurchases: state.subscription.isRestoringPurchases,
  isSettingSubscription: state.subscription.isSettingSubscription,
  errorText: state.subscription.errorText,
  activeSubscription: state.subscription.activeSubscription,
  offerings: state.subscription.offerings,
});

const mapDispatchToProps = {
  getOfferings: subscription.actions.getOfferings,
  purchasePackage: subscription.actions.purchasePackage,
  restorePurchases: subscription.actions.restorePurchases,
  setSubscription: subscription.actions.setSubscription,
  getRevenueCatCustomer: subscription.actions.getCustomer,
};

export default connect(mapStateToProps, mapDispatchToProps);
