import {commitLocalUpdate} from 'react-relay';

const blockOrUnblockUserMutation = (
  environment,
  profileId,
  enabled,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const profile = store.get(profileId);
        const viewer = profile.getLinkedRecord('viewer');

        viewer.setValue(enabled, 'areTheyBlockingMe');

        resolve(profileId);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default blockOrUnblockUserMutation;
