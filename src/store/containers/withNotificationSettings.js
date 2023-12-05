import {connect} from 'react-redux';

import {user} from '../stores';

const mapStateToProps = state => ({
  isUpdatingUser: state.user.isUpdatingUser,
  errorText: state.user.errorText,
  user: state.user.user,
});

const mapDispatchToProps = {
  updateUser: user.actions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps);
