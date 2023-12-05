import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes, Constants} from 'globals';

const updateTradingCardAskingPriceMutation = (
  environment,
  tradingCardId,
  newAskingPrice,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation updateTradingCardAskingPriceMutation($input: ListTradingCardInput!) {
        listTradingCard(input: $input) {
          success
          errors {
            message
          }
          tradingCard {
            id
            state
            listing {
              askingPrice {
                amount
                formattedAmount
                currencyCode
              }
            }
          }
        }
      }`,
      variables: {
        input: {
          tradingCard: {
            id: tradingCardId,
          },
          askingPrice: {
            amount: Number(newAskingPrice || 0) * 100,
            currencyCode: SchemaTypes.currencyCode.USD,
          },
        },
      },
      updater: (store, {listTradingCard: payload}) => {
        if (!payload?.success) {
          return;
        }

        const tradingCard = store.get(tradingCardId);
        tradingCard.setValue(payload.tradingCard?.state || SchemaTypes.tradingCardState.LISTED, 'state');

        const listing = tradingCard.getOrCreateLinkedRecord('listing');
        const askingPrice = listing.getOrCreateLinkedRecord('askingPrice');

        if (askingPrice) {
          askingPrice.setValue(payload.tradingCard?.listing?.askingPrice?.amount, 'amount');
          askingPrice.setValue(payload.tradingCard?.listing?.askingPrice?.formattedAmount, 'formattedAmount');
          askingPrice.setValue(SchemaTypes.currencyCode.USD, 'currencyCode');
        }

        // Updates the Engagement
        const viewer = store.getRoot().getLinkedRecord("viewer");

        let engagementValues = viewer.getValue('engagement') || [];
        if (engagementValues.indexOf(Constants.userEngagement.listed) === -1) {
          engagementValues = [Constants.userEngagement.listed, ...engagementValues];
          viewer.setValue(engagementValues, 'engagement');
        }
      },
      onError: reject,
      onCompleted: ({listTradingCard: payload}) => {
        if (payload?.success && payload?.tradingCard) {
          resolve(payload.tradingCard);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default updateTradingCardAskingPriceMutation;
