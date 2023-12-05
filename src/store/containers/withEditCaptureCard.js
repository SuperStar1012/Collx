import {connect} from 'react-redux';

import {capture, search} from '../stores';

const mapStateToProps = state => ({
  possibleMatchCards: state.capture.possibleMatchCards,
});

const mapDispatchToProps = {
  updateCapturedCard: capture.actions.updateCapturedCard,
  removeCapturedCard: capture.actions.removeCapturedCard,
  setHandleSearchBack: search.actions.setHandleSearchBack,
  setSearchModalMode: search.actions.setSearchModalMode,
};

export default connect(mapStateToProps, mapDispatchToProps);
