import {commitLocalUpdate} from 'react-relay';

const updateProfileInLocalMutation = (
  environment,
  profileData,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const viewer = store.getRoot().getLinkedRecord('viewer');
        const profile = viewer.getLinkedRecord('profile');

        if (profileData.avatarImageUrl) {
          profile.setValue(profileData.avatarImageUrl, 'avatarImageUrl');
        }

        if (profileData.email) {
          profile.setValue(profileData.email, 'email');
          profile.setValue(profileData.name, 'name');
          profile.setValue(profileData.location, 'location');
          profile.setValue(profileData.bio, 'bio');
        }

        profile.setValue(false, 'isAnonymous');

        resolve(profileData);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default updateProfileInLocalMutation;
