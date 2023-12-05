import {graphql, commitMutation} from 'react-relay';

const cancelDealMutation = (
  environment,
  values,
) => {
  const {sellerId, buyerId} = values;

  let cancelDealWith = {};
  if (sellerId) {
    cancelDealWith = {sellerId};
  } else if (buyerId) {
    cancelDealWith = {buyerId};
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation cancelDealMutation($input: CancelDealInput!) {
          cancelDeal(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              cancelledBy
              nextAction
              nextActionDueAt
            }
          }
        }
      `,
      variables: {
        input: {
          with: cancelDealWith,
        },
      },
      updater: (store, {cancelDeal: payload}) => {
        if (!payload?.success || !payload.deal) {
          return;
        }

        const deal = store.get(payload.deal.id);
        if (deal) {
          deal.setValue(payload.deal.state, 'state');
          deal.setValue(payload.deal.cancelledBy, 'cancelledBy');
        }
      },
      onError: reject,
      onCompleted: ({cancelDeal: payload}) => {
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

export default cancelDealMutation;
