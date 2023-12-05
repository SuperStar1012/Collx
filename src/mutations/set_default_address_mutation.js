import {graphql, commitMutation} from 'react-relay';

const setDefaultAddressMutation = (
  environment,
  addressId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setDefaultAddressMutation($input: SetDefaultAddressInput!) {
        setDefaultAddress(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: {
          addressId,
        },
      },
      updater: (store, {setDefaultAddress: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer || !addressId) {
          return;
        }

        if (addressId) {
          const addressRecord = store.get(addressId);

          if (addressRecord) {
            viewer.setLinkedRecord(addressRecord, 'defaultAddress');
          }
        }
      },
      onError: reject,
      onCompleted: ({setDefaultAddress: payload}) => {
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

export default setDefaultAddressMutation;
