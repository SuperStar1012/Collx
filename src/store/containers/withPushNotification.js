import {connect} from 'react-redux';

import {installation, notification, user} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  isFetching: state.installation.isFetching,
  installations: state.installation.installations,
  unreadMessageCount: state.message.unreadMessageCount,
  permissionCheckAllow: state.notification.permissionCheckAllow,
});

const mapDispatchToProps = {
  getInstallations: installation.actions.getInstallations,
  createInstallation: installation.actions.createInstallation,
  updateInstallation: installation.actions.updateInstallation,
  setPushToken: user.actions.setPushToken,
  setPushNotificationAsk: notification.actions.setPushNotificationAsk,
  setPermissionCheckAllow: notification.actions.setPermissionCheckAllow,
};

export default connect(mapStateToProps, mapDispatchToProps);
