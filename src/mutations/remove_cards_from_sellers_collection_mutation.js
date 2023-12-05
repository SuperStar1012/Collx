import {graphql, commitMutation} from 'react-relay';

const removeCardsFromSellersCollectionMutation = (
  environment,
  orderId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation removeCardsFromSellersCollectionMutation($input: RemoveCardsFromSellersCollectionInput!) {
          removeCardsFromSellersCollection(input: $input) {
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
              viewer {
                canChangeTrackingNumber
                canCardsBeRemovedFromSellersCollection
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
      onCompleted: ({removeCardsFromSellersCollection: payload}) => {
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

export default removeCardsFromSellersCollectionMutation;
