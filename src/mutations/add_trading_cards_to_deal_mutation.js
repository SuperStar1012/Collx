import {graphql, commitMutation} from 'react-relay';

const addTradingCardsToDealMutation = (
  environment,
  sellerId,
  tradingCardIds,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation addTradingCardsToDealMutation($input: AddTradingCardsToDealInput!) {
          addTradingCardsToDeal(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              nextAction
              nextActionDueAt
              tradingCards {
                id
                activeDeal {
                  id
                }
                viewer {
                  canAddToDeal
                  canBuyItNow
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          with: {
            sellerId,
          },
          tradingCardIds,
        },
      },
      onError: reject,
      onCompleted: ({addTradingCardsToDeal: payload}) => {
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

export default addTradingCardsToDealMutation;
