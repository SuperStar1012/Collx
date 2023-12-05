import {connect} from 'react-redux';

import {capture, search} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  cameraSoundEffect: state.user.cameraSoundEffect,
  errorText: state.capture.errorText,
  searchingCards: state.capture.searchingCards,
  possibleMatchCards: state.capture.possibleMatchCards,
  capturedCards: state.capture.capturedCards,
  searchedCards: state.capture.searchedCards,
  uploadingCardMedias: state.capture.uploadingCardMedias,
  isShowScanningCategory: state.capture.isShowScanningCategory,
});

const mapDispatchToProps = {
  searchCardVisual: capture.actions.searchCardVisual,
  addCapturedCard: capture.actions.addCapturedCard,
  createUserCards: capture.actions.createUserCards,
  uploadUserCardMedias: capture.actions.uploadUserCardMedias,
  resetCapturedCard: capture.actions.resetCapturedCard,
  setCapturedCards: capture.actions.setCapturedCards,
  updateCapturedCard: capture.actions.updateCapturedCard,
  removeCapturedCard: capture.actions.removeCapturedCard,
  reuploadVisualSearch: capture.actions.reuploadVisualSearch,
  recreateUserCard: capture.actions.recreateUserCard,
  reuploadUserCardMedia: capture.actions.reuploadUserCardMedia,
  setShowScanningCategory: capture.actions.setShowScanningCategory,
  setMutationActions: capture.actions.setMutationActions,
  setSearchModalMode: search.actions.setSearchModalMode,
  setHandleSearchBack: search.actions.setHandleSearchBack,
};

export default connect(mapStateToProps, mapDispatchToProps);
