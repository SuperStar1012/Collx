import {graphql, commitMutation} from 'react-relay';

const setStripePaymentMethodMutation = (
  environment,
  orderId,
  paymentMethodId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setStripePaymentMethodMutation($input: SetStripePaymentMethodInput!) {
        setStripePaymentMethod(input: $input) {
          success
          errors {
            message
          }
          order {
            paymentDetails {
              id
              stripePaymentMethod
            }
          }
        }
      }`,
      variables: {
        input: {
          orderId,
          stripePaymentMethod: paymentMethodId,
        },
      },
      updater: (store, {setStripePaymentMethod: payload}) => {
        if (!payload?.success || !payload?.order?.paymentDetails) {
          return;
        }

        const orderRecord = store.get(orderId);
        if (!orderRecord) {
          return;
        }

        const paymentDetailsRecord = orderRecord.getOrCreateLinkedRecord('paymentDetails');
        if (!paymentDetailsRecord) {
          return;
        }

        paymentDetailsRecord.setValue(payload.order.paymentDetails?.id, 'id');
        paymentDetailsRecord.setValue(payload.order.paymentDetails?.stripePaymentMethod, 'stripePaymentMethod');
      },
      onError: reject,
      onCompleted: ({setStripePaymentMethod: payload}) => {
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

export default setStripePaymentMethodMutation;
