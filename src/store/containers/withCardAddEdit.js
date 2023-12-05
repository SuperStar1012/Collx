import {connect} from 'react-redux';

import {collection, search} from '../stores';

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  setSearchModalMode: search.actions.setSearchModalMode,
  setHandleSearchBack: search.actions.setHandleSearchBack,
  updateUserCardsCount: collection.actions.updateUserCardsCount,
};

export default connect(mapStateToProps, mapDispatchToProps);
