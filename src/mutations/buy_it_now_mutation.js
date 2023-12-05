import {graphql, commitMutation} from 'react-relay';

const buyItNowMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation buyItNowMutation($input: BuyItNowInput!) {
          buyItNow(input: $input) {
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
                viewer {
                  canAddToDeal
                  canBuyItNow
                }
              }
              offer {
                madeBy
                value {
                  amount
                  formattedAmount
                }
              }
              order {
                id
                nextAction
                nextActionDueAt
              }
            }
          }
        }
      `,
      variables: {
        input: params,
      },
      onError: reject,
      onCompleted: ({buyItNow: payload}) => {
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

export default buyItNowMutation;
