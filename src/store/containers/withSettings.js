import {connect} from 'react-redux';

import {collection, user} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  errorText: state.user.errorText,
  isDeletingUser: state.user.isDeletingUser,
  appearanceMode: state.user.appearanceMode,
  cameraSoundEffect: state.user.cameraSoundEffect,
  isFetchingExportCollection: state.collection.isFetchingExportCollection,
  exportCollection: state.collection.exportCollection,
});

const mapDispatchToProps = {
  setAppearanceMode: user.actions.setAppearanceMode,
  setCameraSoundEffect: user.actions.setCameraSoundEffect,
  getExportCollection: collection.actions.getExportCollection,
  deleteUser: user.actions.deleteUser,
  signOut: user.actions.signOut,
};

export default connect(mapStateToProps, mapDispatchToProps);
