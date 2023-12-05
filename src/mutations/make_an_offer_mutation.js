import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const makeAnOfferMutation = (
  environment,
  values,
) => {
  const {sellerId, buyerId, offerAmount} = values;

  let offerTo = {};
  if (sellerId) {
    offerTo = {sellerId};
  } else if (buyerId) {
    offerTo = {buyerId};
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation makeAnOfferMutation($input: MakeAnOfferInput!) {
          makeAnOffer(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              offer {
                madeBy
                value {
                  amount
                  formattedAmount
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          to: offerTo,
          offer: {
            amount: offerAmount,
            currencyCode: SchemaTypes.currencyCode.USD,
          },
        },
      },
      updater: (store, {makeAnOffer: payload}) => {
        if (!payload?.success || !payload.deal) {
          return;
        }

        const deal = store.get(payload.deal.id);
        if (deal) {
          deal.setValue(payload.deal.state, 'state');
          const offer = deal.getOrCreateLinkedRecord('offer');
          offer.setValue(payload.deal.offer.madeBy, 'madeBy');

          const offerValue = offer.getOrCreateLinkedRecord('value');
          offerValue.setValue(payload.deal.offer?.value.amount, 'amount');
          offerValue.setValue(payload.deal.offer?.value.formattedAmount, 'formattedAmount');
        }
      },
      onError: reject,
      onCompleted: ({makeAnOffer: payload}) => {
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

export default makeAnOfferMutation;
