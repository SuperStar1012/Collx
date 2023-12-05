import {graphql, commitMutation} from 'react-relay';

const setSellerDiscountMutation = (
  environment,
  discount,
  threshold,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setSellerDiscountMutation($input: SetSellerDiscountInput!) {
        setSellerDiscount(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: {
          discount,
          threshold,
        },
      },
      updater: (store, {setSellerDiscount: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer) {
          return;
        }

        const sellerSettings = viewer.getLinkedRecord('sellerSettings');
        if (!sellerSettings) {
          return;
        }

        sellerSettings.setValue(discount, 'discount');
        sellerSettings.setValue(threshold, 'threshold');
      },
      onError: reject,
      onCompleted: ({setSellerDiscount: payload}) => {
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

export default setSellerDiscountMutation;
