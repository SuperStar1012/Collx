import {connect} from 'react-redux';

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps);
