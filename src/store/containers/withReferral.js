import {connect} from 'react-redux';

import {friend, referral} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  hashFriends: state.friend.hashFriends,
  approvedReferrals: state.referral.approvedReferrals,
});

const mapDispatchToProps = {
  getHashFriends: friend.actions.getHashFriends,
  getReferrals: referral.actions.getReferrals,
};

export default connect(mapStateToProps, mapDispatchToProps);
