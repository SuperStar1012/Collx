import {graphql, commitMutation} from 'react-relay';
import _ from 'lodash';

import {SchemaTypes} from 'globals';

const updateTradingCardMutation = (
  environment,
  tradingCardId,
  values,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation updateTradingCardMutation($input: UpdateTradingCardInput!) {
          updateTradingCard(input: $input) {
            success
            errors {
              message
            }
            tradingCard {
              condition {
                name
                gradingScale {
                  name
                }
              }
              state
              listing{
                askingPrice {
                  amount
                  formattedAmount
                }
              }
              sale {
                soldFor {
                  amount
                  formattedAmount
                }
              }
              marketValue {
                source
                price {
                  amount
                  formattedAmount
                }
              }
              card {
                set {
                  name
                }
                number
                name
                ...on SportCard {
                  sport
                  player {
                    name
                  }
                  team {
                    name
                  }
                }
                ...on GameCard {
                  game
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          id: tradingCardId,
          with: values,
        },
      },
      updater: (store, {updateTradingCard: payload}) => {
        if (!payload?.success) {
          return;
        }

        const tradingCard = store.get(tradingCardId);

        if (!tradingCard) {
          return;
        }

        tradingCard.setValue(payload.tradingCard?.state, 'state');

        if (payload.tradingCard?.listing) {
          const listingRecord = tradingCard.getOrCreateLinkedRecord('listing');
          const askingPriceRecord = listingRecord.getOrCreateLinkedRecord('askingPrice');

          askingPriceRecord.setValue(payload.tradingCard?.listing?.askingPrice?.amount, 'amount');
          askingPriceRecord.setValue(payload.tradingCard?.listing?.askingPrice?.formattedAmount, 'formattedAmount');
          askingPriceRecord.setValue(SchemaTypes.currencyCode.USD, 'currencyCode');
        }

        if (payload.tradingCard?.sale) {
          const saleRecord = tradingCard.getOrCreateLinkedRecord('sale');
          const soldForRecord = saleRecord.getOrCreateLinkedRecord('soldFor');

          soldForRecord.setValue(payload.tradingCard?.sale?.soldFor?.amount, 'amount');
          soldForRecord.setValue(payload.tradingCard?.sale?.soldFor?.formattedAmount, 'formattedAmount');
          soldForRecord.setValue(SchemaTypes.currencyCode.USD, 'currencyCode');
        }

        if (payload.tradingCard?.marketValue) {
          const marketValueRecord = tradingCard.getOrCreateLinkedRecord('marketValue');
          marketValueRecord.setValue(payload.tradingCard?.marketValue?.source, 'source');
          const priceRecord = marketValueRecord.getOrCreateLinkedRecord('price');

          priceRecord.setValue(payload.tradingCard?.marketValue?.price?.amount, 'amount');
          priceRecord.setValue(payload.tradingCard?.marketValue?.price?.formattedAmount, 'formattedAmount');
          priceRecord.setValue(SchemaTypes.currencyCode.USD, 'currencyCode');
        }

        // if (_.has(values, 'public')) {
        //   tradingCard.setValue(values.public, 'public');
        // }

        if (_.has(values, 'notes')) {
          tradingCard.setValue(values.notes || "", 'notes');
        }

        if (_.has(values, 'purchasePrice')) {
          if (values.purchasePrice) {
            const purchasePriceRecord = tradingCard.getOrCreateLinkedRecord('purchasePrice');
            const purchasePrice = values.purchasePrice.amount / 100;
            purchasePriceRecord.setValue(purchasePrice?.toFixed(2), 'amount');
            purchasePriceRecord.setValue(values.purchasePrice.currencyCode, 'currencyCode');
          } else {
            tradingCard.setValue(null, 'purchasePrice');
          }
        }

        if (_.has(values, 'purchaseDate')) {
          tradingCard.setValue(values.purchaseDate, 'purchaseDate');
        }

        if (_.has(values, 'certificationNumber')) {
          tradingCard.setValue(values.certificationNumber, 'certificationNumber');
        }

        if (payload.tradingCard?.condition) {
          const condition = payload.tradingCard?.condition;
          const conditionRecord = tradingCard.getOrCreateLinkedRecord('condition');
          conditionRecord.setValue(condition.name, 'name');
          const gradingScaleRecord = conditionRecord.getOrCreateLinkedRecord('gradingScale');
          gradingScaleRecord.setValue(condition.gradingScale.name, 'name');
        } else {
          tradingCard.setValue(null, 'condition');
        }

        if (_.has(values, 'card')) {
          const canonicalCardRecord = tradingCard.getOrCreateLinkedRecord('card');
          canonicalCardRecord.setValue(payload.tradingCard?.card?.name, 'name');
          canonicalCardRecord.setValue(payload.tradingCard?.card?.number, 'number');

          const canonicalCardSetRecord = canonicalCardRecord.getOrCreateLinkedRecord('set');
          canonicalCardSetRecord.setValue(payload.tradingCard?.card?.set?.name, 'name');

          const canonicalCardPlayerRecord = canonicalCardRecord.getOrCreateLinkedRecord('player');
          canonicalCardPlayerRecord.setValue(payload.tradingCard?.card?.player?.name, 'name');

          const canonicalCardTeamRecord = canonicalCardRecord.getOrCreateLinkedRecord('team');
          canonicalCardTeamRecord.setValue(payload.tradingCard?.card?.team?.name, 'name');
        }
      },
      onError: reject,
      onCompleted: ({updateTradingCard: payload}) => {
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

export default updateTradingCardMutation;
