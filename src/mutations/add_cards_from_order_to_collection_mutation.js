import {graphql, commitMutation} from 'react-relay';

const addCardsFromOrderToCollectionMutation = (
  environment,
  orderId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation addCardsFromOrderToCollectionMutation($input: AddCardsFromOrderToCollectionInput!) {
          addCardsFromOrderToCollection(input: $input) {
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
              deal {
                tradingCards {
                  id
                }
                nextAction
                nextActionDueAt
              }
              viewer {
                canCardsBeMovedToCollection
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
      updater: (store, {addCardsFromOrderToCollection: payload}) => {
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
      onCompleted: ({addCardsFromOrderToCollection: payload}) => {
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

export default addCardsFromOrderToCollectionMutation;

