import {graphql, commitMutation} from 'react-relay';

const setShippingAddressMutation = (
  environment,
  orderId,
  addressId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setShippingAddressMutation($input: SetShippingAddressInput!) {
        setShippingAddress(input: $input) {
          success
          errors {
            message
          }
          # order {
          #   id
          #   shippingAddress {
          #     id
          #     careOf
          #     address1
          #     address2
          #     city
          #     state
          #     postalCode
          #   }
          #   viewer {
          #     canICancel
          #     canICheckout
          #     reasonICantCheckout
          #   }
          # }
        }
      }`,
      variables: {
        input: {
          addressId,
          orderId,
        },
      },
      onError: reject,
      onCompleted: ({setShippingAddress: payload}) => {
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

export default setShippingAddressMutation;
