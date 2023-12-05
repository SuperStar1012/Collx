import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const setBalanceToApplyToOrderMutation = (
  environment,
  orderId,
  price,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setBalanceToApplyToOrderMutation($input: SetBalanceToApplyToOrderInput!) {
        setBalanceToApplyToOrder(input: $input) {
          success
          errors {
            message
          }
          order {
            viewer {
              balanceThatCanBeApplied {
                amount
              }
              creditThatCanBeApplied {
                amount
              }
            }
            balanceApplied {
              amount
              formattedAmount
              currencyCode
            }
            chargeBreakdown {
              type
              value {
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
          orderId,
          value: {
            amount: price,
            currencyCode: SchemaTypes.currencyCode.USD,
          },
        },
      },
      onError: reject,
      onCompleted: ({setBalanceToApplyToOrder: payload}) => {
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

export default setBalanceToApplyToOrderMutation;
