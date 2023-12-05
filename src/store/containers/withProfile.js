import {connect} from 'react-redux';

import {
  filter,
  user,
  emailVerification,
} from '../stores';

const mapStateToProps = state => ({
  isFetching: state.user.isFetching,
  isUpdatingUser: state.user.isUpdatingUser,
  isUploadingAvatar: state.user.isUploadingAvatar,
  user: state.user.user,
  errorText: state.user.errorText,
});

const mapDispatchToProps = {
  uploadAvatar: user.actions.uploadAvatar,
  updateUser: user.actions.updateUser,
  updatePassword: user.actions.updatePassword,
  setBlock: user.actions.setBlock,
  setFilter: filter.actions.setFilter,
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
  signOut: user.actions.signOut,
};

export default connect(mapStateToProps, mapDispatchToProps);
