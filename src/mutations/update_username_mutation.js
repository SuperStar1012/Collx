import {graphql, commitMutation} from 'react-relay';

const updateUsernameMutation = (
  environment,
  username,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation updateUsernameMutation($input: UpdateUsernameInput!) {
        updateUsername(input: $input) {
          success
          errors {
            message
          }
          profile {
            id
            username
          }
        }
      }`,
      variables: {
        input: {
          username,
        },
      },
      onError: reject,
      onCompleted: ({updateUsername: payload}) => {
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

export default updateUsernameMutation;
