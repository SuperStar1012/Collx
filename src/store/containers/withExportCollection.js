import {connect} from 'react-redux';

import {collection} from '../stores';

const mapStateToProps = state => ({
  isFetchingExportCollection: state.collection.isFetchingExportCollection,
  isSettingExportCollection: state.collection.isSettingExportCollection,
  isSettingPrintChecklist: state.collection.isSettingPrintChecklist,
  isDidPrintChecklist: state.collection.isDidPrintChecklist,
  exportCollection: state.collection.exportCollection,
  errorText: state.collection.errorText,
});

const mapDispatchToProps = {
  getExportCollection: collection.actions.getExportCollection,
  setExportCollection: collection.actions.setExportCollection,
  setPrintChecklist: collection.actions.setPrintChecklist,
};

export default connect(mapStateToProps, mapDispatchToProps);
