import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const setCreditsToApplyToOrderMutation = (
  environment,
  orderId,
  price,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setCreditsToApplyToOrderMutation($input: SetCreditsToApplyToOrderInput!) {
        setCreditsToApplyToOrder(input: $input) {
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
              canICancel
              canICheckout
              reasonICantCheckout
            }
            creditApplied {
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
      onCompleted: ({setCreditsToApplyToOrder: payload}) => {
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

export default setCreditsToApplyToOrderMutation;
