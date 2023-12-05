import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'react-relay';

const markReadAllNotificationMutation = (
  environment,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation markReadAllNotificationMutation {
        markReadAllNotification {
          success
          errors {
            message
          }
          viewer {
            notificationUnreadCount
          }
        }
      }`,
      variables: {},
      updater: (store, {markReadAllNotification: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer) {
          return;
        }

        // Connections
        const notificationConnection = ConnectionHandler.getConnection(
          viewer,
          'NotificationsPageQuery_viewer__notifications',
          {
            with: {types: ['COMMENT', 'COMMENT_REPLY', 'CREDIT', 'DEEPLINK', 'FOLLOW', 'INFO', 'LIKE', 'UPDATE', 'WEBLINK']},
          }
        );

        if (!notificationConnection) {
          return;
        }

        notificationConnection.setValue(0, 'unreadCount');

        const notificationsEdges = notificationConnection.getLinkedRecords("edges");

        const filteredEdges = notificationsEdges.filter((edge) => {
          const notificationNode = edge.getLinkedRecord('node');
          const read = notificationNode.getValue('read');
          return !read;
        });

        filteredEdges.map((edge) => {
          const notificationNode = edge.getLinkedRecord('node');
          const read = notificationNode.getValue('read');

          if (!read) {
            notificationNode.setValue(true, 'read');
          }
        });
      },
      onError: reject,
      onCompleted: ({markReadAllNotification: payload}) => {
        if (payload?.success) {
          resolve();
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default markReadAllNotificationMutation;
