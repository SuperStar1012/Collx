import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const soldTradingCardMutation = (
  environment,
  tradingCardId,
  salePrice,
  saleType,
) => {
  const params = {
    tradingCard: {id: tradingCardId},
    type: saleType.toUpperCase()
  };

  if (salePrice) {
    params.salePrice = {
      amount: Number(salePrice || 0),
      currencyCode: SchemaTypes.currencyCode.USD,
    }
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation soldTradingCardMutation($input: SoldTradingCardInput!) {
        soldTradingCard(input: $input) {
          success
          errors {
            message
          }
          tradingCard {
            id
            state
            sale {
              soldFor {
                amount
                formattedAmount
                currencyCode
              }
            }
          }
        }
      }`,
      variables: {
        input: params,
      },
      updater: (store, {soldTradingCard: payload}) => {
        if (!payload?.success) {
          return;
        }

        const tradingCard = store.get(tradingCardId);
        tradingCard.setValue(payload.tradingCard?.state || SchemaTypes.tradingCardState.SOLD, 'state');

        const listingRecord = tradingCard.getLinkedRecord('listing');
        if (listingRecord) {
          listingRecord.invalidateRecord();
        }

        const sale = tradingCard.getOrCreateLinkedRecord('sale');
        const soldPrice = sale.getOrCreateLinkedRecord('soldFor');
        if (soldPrice) {
          soldPrice.setValue(payload.tradingCard?.sale?.soldFor?.amount, 'amount');
          soldPrice.setValue(payload.tradingCard?.sale?.soldFor?.formattedAmount, 'formattedAmount');
          soldPrice.setValue(SchemaTypes.currencyCode.USD, 'currencyCode');
        }
      },
      onError: reject,
      onCompleted: ({soldTradingCard: payload}) => {
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

export default soldTradingCardMutation;
