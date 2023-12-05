import {graphql, commitMutation} from 'react-relay';

const markOrderAsCompletedMutation = (
  environment,
  orderId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation markOrderAsCompletedMutation($input: MarkOrderAsCompletedInput!) {
          markOrderAsCompleted(input: $input) {
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
                canCardsBeMovedToCollection
                canIRequestRefund
                canIMarkAsCompleted
              }
            }
          }
        }
      `,
      variables: {
        input: {
          orderId
        },
      },
      updater: (store, {markOrderAsCompleted: payload}) => {
        if (!payload?.success || !payload.order) {
          return;
        }

        const orderRecord = store.get(payload.order?.id);
        if (!orderRecord) {
          return;
        }

        orderRecord.setValue(payload.order?.state, 'state');
      },
      onError: reject,
      onCompleted: ({markOrderAsCompleted: payload}) => {
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

export default markOrderAsCompletedMutation;
