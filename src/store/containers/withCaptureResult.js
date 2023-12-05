import {connect} from 'react-redux';

import {capture, search, emailVerification} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  isFetching: state.capture.isFetching,
  errorText: state.capture.errorText,
  possibleMatchCards: state.capture.possibleMatchCards,
  capturedCards: state.capture.capturedCards,
  searchedCards: state.capture.searchedCards,
  updatedCardIds: state.capture.updatedCardIds,
});

const mapDispatchToProps = {
  updateCapturedCard: capture.actions.updateCapturedCard,
  removeCapturedCard: capture.actions.removeCapturedCard,
  confirmUserCard: capture.actions.confirmUserCard,
  reuploadVisualSearch: capture.actions.reuploadVisualSearch,
  recreateUserCard: capture.actions.recreateUserCard,
  reuploadUserCardMedia: capture.actions.reuploadUserCardMedia,
  setPossibleMatchCards: capture.actions.setPossibleMatchCards,
  setSearchModalMode: search.actions.setSearchModalMode,
  setHandleSearchBack: search.actions.setHandleSearchBack,
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
};

export default connect(mapStateToProps, mapDispatchToProps);
