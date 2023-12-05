import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const withdrawMoneyMutation = (
  environment,
  externalAccountId,
  amount,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation withdrawMoneyMutation($input: WithdrawMoneyInput!) {
        withdrawMoney(input: $input) {
          success
          errors {
            message
          }
          myMoney {
            credit {
              balance {
                amount
                formattedAmount
              }
            }
            pending {
              balance {
                amount
                formattedAmount
              }
            }
            settled {
              balance {
                amount
                formattedAmount
              }
            }
          }
        }
      }`,
      variables: {
        input: {
          externalAccountId,
          amountToReedem: {
            amount,
            currencyCode: SchemaTypes.currencyCode.USD,
          },
        },
      },
      onError: reject,
      onCompleted: ({withdrawMoney: payload}) => {
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

export default withdrawMoneyMutation;
