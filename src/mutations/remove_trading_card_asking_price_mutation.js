import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const removeTradingCardAskingPriceMutation = (
  environment,
  tradingCardId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation removeTradingCardAskingPriceMutation($input: DelistTradingCardInput!) {
        delistTradingCard(input: $input) {
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
        },
      },
      optimisticUpdater: (store) => {
        const tradingCard = store.get(tradingCardId);
        tradingCard.setValue(SchemaTypes.tradingCardState.ACCEPTING_OFFERS, 'state');
        const listingRecord = tradingCard.getLinkedRecord('listing')
        if (listingRecord) {
          listingRecord.invalidateRecord();
        }
      },
      onError: reject,
      onCompleted: ({delistTradingCard: payload}) => {
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

export default removeTradingCardAskingPriceMutation;
