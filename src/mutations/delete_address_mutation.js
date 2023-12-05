import {graphql, commitMutation} from 'react-relay';

const deleteAddressMutation = (
  environment,
  addressId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation deleteAddressMutation($input: DeleteAddressInput!) {
        deleteAddress(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: {
          with: {
            addressId,
          },
        },
      },
      updater: (store, {deleteAddress: payload}) => {
        if (!payload?.success || !addressId) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer) {
          return;
        }

        const addressesRecords = viewer.getLinkedRecords('addresses');
        if (addressesRecords) {
          const filteredAddresses = addressesRecords.filter((address) => address.getDataID() !== addressId);
          viewer.setLinkedRecords(filteredAddresses, 'addresses');
        }

        const defaultAddressRecord = viewer.getLinkedRecord('defaultAddress');
        if (defaultAddressRecord && defaultAddressRecord.getDataID() === addressId) {
          viewer.setValue(null, 'defaultAddress');
        }

        store.delete(addressId);
      },
      onError: reject,
      onCompleted: ({deleteAddress: payload}) => {
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

export default deleteAddressMutation;
