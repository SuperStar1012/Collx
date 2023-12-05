import {connect} from 'react-redux';

import {emailVerification} from '../stores';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
};

export default connect(mapStateToProps, mapDispatchToProps);
