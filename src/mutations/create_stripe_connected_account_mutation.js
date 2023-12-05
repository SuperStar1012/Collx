import {graphql, commitMutation} from 'react-relay';

const createStripeConnectedAccountMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation createStripeConnectedAccountMutation($input: CreateStripeConnectedAccountInput!) {
          createStripeConnectedAccount(input: $input) {
            success
            errors {
              message
            }
            viewer {
              buyerSettings {
                stripeConnectedAccountId
              }
            }
          }
        }
      `,
      variables: {
        input: params,
      },
      onError: reject,
      onCompleted: ({createStripeConnectedAccount: payload}) => {
        if (payload?.success && payload?.viewer?.buyerSettings) {
          resolve(payload.viewer.buyerSettings);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default createStripeConnectedAccountMutation;
