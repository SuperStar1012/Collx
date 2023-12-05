import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const createIssueMutation = (
  environment,
  values,
) => {
  const {
    category,
    forInput,
    notes,
    type,
    tradingCardIdForIssue,
  } = values;

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation createIssueMutation($input: CreateIssueInput!) {
          createIssue(input: $input) {
            success
            errors {
              message
            }
            issue {
              id
              sale {
                id
                card {
                  id
                  marketValue {
                    source
                    price {
                      amount
                      formattedAmount
                    }
                  }
                  allMarketValues {
                    condition {
                      name
                    }
                    marketValue {
                      source
                      price {
                        formattedAmount
                      }
                    }
                  }
                  recentSales {
                    byCondition {
                      sales {
                        id
                        soldFor {
                          formattedAmount
                        }
                      }
                    }
                  }
                }
              }
              order {
                id
                state
                stateGroup
                nextAction
                nextActionDueAt
                viewer {
                  canIRequestRefund
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          category,
          for: forInput,
          notes,
          type,
        },
      },
      updater: (store, {createIssue: payload}) => {

        if (!payload?.success) {
          return;
        }

        const sale = payload.issue?.sale;
        if (!sale || !sale?.id) {
          return;
        }

        const saleRecord = store.get(sale.id);
        saleRecord.invalidateRecord();

        if (!tradingCardIdForIssue) {
          return;
        }

        const tradingCard = store.get(tradingCardIdForIssue);
        if (!tradingCard) {
          return;
        }

        const marketValue = sale.card?.marketValue;

        if (marketValue) {
          const marketValueRecord = tradingCard.getOrCreateLinkedRecord('marketValue');
          marketValueRecord.setValue(marketValue.source, 'source');

          const priceRecord = marketValueRecord.getOrCreateLinkedRecord('price');
          priceRecord.setValue(marketValue.price?.amount, 'amount');
          priceRecord.setValue(marketValue.price?.formattedAmount, 'formattedAmount');
          priceRecord.setValue(SchemaTypes.currencyCode.USD, 'currencyCode');
        }
      },
      onError: reject,
      onCompleted: ({createIssue: payload}) => {
        if (payload?.success && payload?.issue?.id) {
          resolve(payload.issue.id);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default createIssueMutation;
