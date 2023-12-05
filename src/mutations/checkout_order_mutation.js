import {graphql, commitMutation} from 'react-relay';

import {SchemaTypes} from 'globals';

const checkoutOrderMutation = (
  environment,
  orderId,
  stripePaymentMethod,
) => {
  const params = {
    balancePaymentMethod: SchemaTypes.checkoutOrderBalancePaymentMethod.STRIPE,
    orderId,
  };

  if (stripePaymentMethod) {
    params.stripePaymentMethod = stripePaymentMethod;
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation checkoutOrderMutation($input: CheckoutOrderInput!) {
          checkoutOrder(input: $input) {
            success
            errors {
              message
            }
            order {
              id
              state
              stateGroup
              nextAction
              nextActionDueAt
              deal {
                id
                state
                nextAction
                nextActionDueAt
                tradingCards {
                  id
                  state
                  viewer {
                    canAddToDeal
                    canBuyItNow
                  }
                }
              }
              paymentDetails {
                stripeClientSecret
                stripePaymentIntent
                stripePaymentMethod
              }
              viewer {
                canICheckout
                canIRequestRefund
                reasonICantCheckout
              }
            }
          }
        }
      `,
      variables: {
        input: params,
      },
      onError: reject,
      onCompleted: ({checkoutOrder: payload}) => {
        if (payload?.success) {
          resolve(payload.order);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default checkoutOrderMutation;
