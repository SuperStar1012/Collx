import {graphql, commitMutation} from 'react-relay';

const markReturnAsDeliveredMutation = (
  environment,
  orderId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation markReturnAsDeliveredMutation($input: MarkReturnAsDeliveredInput!) {
          markReturnAsDelivered(input: $input) {
            success
            errors {
              message
            }
            order {
              id
              state
              stateGroup
              nextAction
              nextActionDueAt
              timeline(first: 20) {
                edges {
                  node {
                    id
                    createdAt
                    toState
                  }
                }
              }
              viewer {
                canIRequestRefund
                packingListUrl
              }
            }
          }
        }
      `,
      variables: {
        input: {
          orderId,
        },
      },
      onError: reject,
      onCompleted: ({markReturnAsDelivered: payload}) => {
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

export default markReturnAsDeliveredMutation;
