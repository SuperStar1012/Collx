import {graphql, commitMutation} from 'react-relay';

const acceptOfferMutation = (
  environment,
  values,
) => {
  const {sellerId, buyerId} = values;

  let offerFrom = {};
  if (sellerId) {
    offerFrom = {sellerId};
  } else if (buyerId) {
    offerFrom = {buyerId};
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation acceptOfferMutation($input: AcceptOfferInput!) {
          acceptOffer(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              nextAction
              nextActionDueAt
              order {
                id
                state
                nextAction
                nextActionDueAt
              }
            }
          }
        }
      `,
      variables: {
        input: {
          from: offerFrom,
        },
      },
      onError: reject,
      onCompleted: ({acceptOffer: payload}) => {
        if (payload?.success && payload?.deal) {
          resolve(payload.deal);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default acceptOfferMutation;
