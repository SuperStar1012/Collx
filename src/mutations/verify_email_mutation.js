import {graphql, commitMutation} from 'react-relay';

const verifyEmailMutation = (
  environment,
  emailVerificationToken,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation verifyEmailMutation($input: VerifyEmailInput!) {
          verifyEmail(input:$input) {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input : {
          emailVerificationToken,
        }
      },
      onError: reject,
      onCompleted: ({verifyEmail: payload}) => {
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

export default verifyEmailMutation;
