import {connect} from 'react-redux';

import {collection, filter, search, emailVerification} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  sort: state.filter.sort,
  filter: state.filter.filter,
  isEnabledPreserveSettings: state.filter.isEnabledPreserveSettings,
  userCardsActionCount: state.collection.userCardsActionCount,
});

const mapDispatchToProps = {
  getUserCardFilters: filter.actions.getUserCardFilters,
  setSort: filter.actions.setSort,
  setFilter: filter.actions.setFilter,
  setDrawerOpenMode: filter.actions.setDrawerOpenMode,
  setEnabledPreserveSettings: filter.actions.setEnabledPreserveSettings,
  setHandleSearchBack: search.actions.setHandleSearchBack,
  setSearchModalMode: search.actions.setSearchModalMode,
  updateUserCardsCount: collection.actions.updateUserCardsCount,
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
};

export default connect(mapStateToProps, mapDispatchToProps);
