import {graphql, commitMutation} from 'react-relay';

const updateStripeConnectedAccountMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation updateStripeConnectedAccountMutation($input: UpdateStripeConnectedAccountInput!) {
          updateStripeConnectedAccount(input: $input) {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input: params,
      },
      onError: reject,
      onCompleted: ({updateStripeConnectedAccount: payload}) => {
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

export default updateStripeConnectedAccountMutation;
