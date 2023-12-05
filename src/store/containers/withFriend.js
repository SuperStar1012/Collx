import {connect} from 'react-redux';

import {friend, user, referral} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  isFetching: state.friend.isFetching,
  errorText: state.friend.errorText,
  friends: state.friend.friends,
  topFriends: state.friend.topFriends,
  hashFriends: state.friend.hashFriends,
  approvedReferrals: state.referral.approvedReferrals,
  claimedReferrals: state.referral.claimedReferrals,
  isAuthenticated: state.user.isAuthenticated,
  isCompletedSignUp: state.user.isCompletedSignUp,
  isFetchingReferral: state.referral.isFetching,
});

const mapDispatchToProps = {
  getFriends: friend.actions.getFriends,
  getTopFriends: friend.actions.getTopFriends,
  getHashFriends: friend.actions.getHashFriends,
  setFollow: user.actions.setFollow,
  signUpComplete: user.actions.signUpComplete,
  resetSignUp: user.actions.resetSignUp,
  getReferrals: referral.actions.getReferrals,
};

export default connect(mapStateToProps, mapDispatchToProps);
