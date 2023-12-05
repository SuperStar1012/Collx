import {connect} from 'react-redux';

import {emailVerification} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  verifiedAction: state.emailVerification.verifiedAction,
  isEmailVerified: state.emailVerification.isEmailVerified,
});

const mapDispatchToProps = {
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
  setEmailVerified: emailVerification.actions.setEmailVerified,
};

export default connect(mapStateToProps, mapDispatchToProps);
