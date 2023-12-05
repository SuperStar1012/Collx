import {connect} from 'react-redux';

import {address, referral} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  isFetchingAddress: state.address.isFetching,
  addresses: state.address.addresses,
  isFetchingReferral: state.referral.isFetching,
  errorText: state.referral.errorText,
  newReward: state.referral.newReward,
});

const mapDispatchToProps = {
  getAddresses: address.actions.getAddresses,
  setReward: referral.actions.setReward,
};

export default connect(mapStateToProps, mapDispatchToProps);
