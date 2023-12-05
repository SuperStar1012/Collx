import {connect} from 'react-redux';

import {set} from '../stores';

const mapStateToProps = state => ({
  isFetching: state.set.isFetching,
  errorText: state.set.errorText,
  sets: state.set.sets,
  searchModalMode: state.search.searchModalMode,
});

const mapDispatchToProps = {
  getSets: set.actions.getSets,
};

export default connect(mapStateToProps, mapDispatchToProps);
