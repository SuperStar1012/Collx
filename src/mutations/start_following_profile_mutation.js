import {graphql, commitMutation} from 'react-relay';

import {Constants} from 'globals';

const startFollowingProfileMutation = (
  environment,
  profileId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation startFollowingProfileMutation($input: StartFollowingInput!) {
          startFollowing(input: $input) {
            success
            errors {
              message
            }
            profile {
              id
              viewer {
                amIFollowingThem
              }
            }
          }
        }
      `,
      variables: {
        input: {
          profile: {
            id: profileId,
          },
        },
      },
      optimisticUpdater: (store) => {
        store.get(profileId)
          .getLinkedRecord('viewer')
          .setValue(true, 'amIFollowingThem');

        // Updates the Engagement
        const viewer = store.getRoot().getLinkedRecord("viewer");

        let engagementValues = viewer.getValue('engagement') || [];
        if (engagementValues.indexOf(Constants.userEngagement.followed) === -1) {
          engagementValues = [Constants.userEngagement.followed, ...engagementValues];
          viewer.setValue(engagementValues, 'engagement');
        }
      },
      onError: reject,
      onCompleted: ({startFollowing: payload}) => {
        if (payload?.success && payload?.profile) {
          resolve(payload.profile);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default startFollowingProfileMutation;
