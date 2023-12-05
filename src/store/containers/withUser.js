import {connect} from 'react-redux';

import {referral, user} from '../stores';

const mapStateToProps = state => ({
  isFetching: state.user.isFetching,
  isUpdatingUser: state.user.isUpdatingUser,
  isUploadingAvatar: state.user.isUploadingAvatar,
  isAuthenticated: state.user.isAuthenticated,
  isCompletedSignUp: state.user.isCompletedSignUp,
  errorText: state.user.errorText,
  user: state.user.user,
  lookup: state.user.lookup,
  lookedupSocial: state.user.lookedupSocial,
  isFetchingReferral: state.referral.isFetching,
  referralErrorText: state.referral.errorText,
  newReferral: state.referral.newReferral,
});

const mapDispatchToProps = {
  signIn: user.actions.signIn,
  signUp: user.actions.signUp,
  signUpComplete: user.actions.signUpComplete,
  updateUser: user.actions.updateUser,
  lookUp: user.actions.lookUp,
  lookUpSocial: user.actions.lookUpSocial,
  resetPassword: user.actions.resetPassword,
  createLink: user.actions.createLink,
  uploadAvatar: user.actions.uploadAvatar,
  setReferral: referral.actions.setReferral,
};

export default connect(mapStateToProps, mapDispatchToProps);
