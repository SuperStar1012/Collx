import {graphql, commitMutation} from 'react-relay';

const cancelOrderMutation = (
  environment,
  orderId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation cancelOrderMutation($input: CancelOrderInput!) {
          cancelOrder(input: $input) {
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
                canICheckout
                canCardsBeRemovedFromSellersCollection
                canCardsBeMovedToCollection
                canChangeTrackingNumber
                canIMarkAsCompleted
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
      updater: (store, {cancelOrder: payload}) => {
        if (!payload?.success || !payload.order) {
          return;
        }

        const order = store.get(payload.order.id);
        if (order) {
          order.setValue(payload.order.state, 'state');
        }
      },
      onError: reject,
      onCompleted: ({cancelOrder: payload}) => {
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

export default cancelOrderMutation;
