import {commitLocalUpdate} from 'react-relay';

const updateUserTypeMutation = (
  environment,
  userType,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const viewer = store.getRoot().getLinkedRecord('viewer');
        const profile = viewer.getLinkedRecord('profile');

        if (userType) {
          profile.setValue(userType, 'type');
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default updateUserTypeMutation;
