import {connect} from 'react-redux';

const mapStateToProps = state => ({
  isServerMaintenance: state.maintenance.isServerMaintenance,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps);
