import {graphql, commitMutation} from 'react-relay';

const rejectOfferMutation = (
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
        mutation rejectOfferMutation($input: RejectOfferInput!) {
          rejectOffer(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              nextAction
              nextActionDueAt
            }
          }
        }
      `,
      variables: {
        input: {
          from: offerFrom,
        },
      },
      updater: (store, {rejectOffer: payload}) => {
        if (!payload?.success || !payload.deal) {
          return;
        }

        const deal = store.get(payload.deal.id);
        if (deal) {
          deal.setValue(payload.deal.state, 'state');
        }
      },
      onError: reject,
      onCompleted: ({rejectOffer: payload}) => {
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

export default rejectOfferMutation;
