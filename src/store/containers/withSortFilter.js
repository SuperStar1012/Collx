import {connect} from 'react-redux';

import {filter} from '../stores';

const mapStateToProps = state => ({
  sort: state.filter.sort,
  filter: state.filter.filter,
  drawerOpenMode: state.filter.drawerOpenMode,
  cardFilters: state.filter.cardFilters,
});

const mapDispatchToProps = {
  setSort: filter.actions.setSort,
  setFilter: filter.actions.setFilter,
  setEnabledPreserveSettings: filter.actions.setEnabledPreserveSettings,
};

export default connect(mapStateToProps, mapDispatchToProps);
