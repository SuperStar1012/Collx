import {graphql, commitMutation} from 'react-relay';

const initiateEmailVerificationMutation = (
  environment,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation initiateEmailVerificationMutation {
          initiateEmailVerification {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {},
      onError: reject,
      onCompleted: ({initiateEmailVerification: payload}) => {
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

export default initiateEmailVerificationMutation;
