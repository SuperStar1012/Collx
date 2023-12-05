import {graphql, commitMutation} from 'react-relay';

const setUserPrivacySettingsMutation = (
  environment,
  showCollectionValueInApp,
  showCollectionValueOnWeb,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setUserPrivacySettingsMutation($input: SetUserPrivacySettingsInput!) {
        setUserPrivacySettings(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: {
          showCollectionValueInApp,
          showCollectionValueOnWeb,
        },
      },
      updater: (store, {setUserPrivacySettings: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer) {
          return;
        }

        const privacySettings = viewer.getLinkedRecord('privacySettings');
        if (!privacySettings) {
          return;
        }

        privacySettings.setValue(showCollectionValueInApp, 'showCollectionValueInApp');
        privacySettings.setValue(showCollectionValueOnWeb, 'showCollectionValueOnWeb');
      },
      onError: reject,
      onCompleted: ({setUserPrivacySettings: payload}) => {
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

export default setUserPrivacySettingsMutation;
