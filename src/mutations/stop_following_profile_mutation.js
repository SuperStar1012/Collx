import {graphql, commitMutation} from 'react-relay';

const stopFollowingProfileMutation = (
  environment,
  profileId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation stopFollowingProfileMutation($input: StopFollowingInput!) {
          stopFollowing(input: $input) {
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
          .setValue(false, 'amIFollowingThem');
      },
      onError: reject,
      onCompleted: ({stopFollowing: payload}) => {
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

export default stopFollowingProfileMutation;
