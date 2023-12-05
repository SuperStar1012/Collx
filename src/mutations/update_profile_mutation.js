import {graphql, commitMutation} from 'react-relay';

const updateProfileMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation updateProfileMutation($input: UpdateProfileInput!) {
        updateProfile(input:$input) {
          success
          errors {
            message
          }
          profile {
            id
            socialMedia {
              userId
              site
            }
          }
        }
      }`,
      variables: {
        input: params,
      },
      onError: reject,
      onCompleted: ({updateProfile: payload}) => {
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

export default updateProfileMutation;
