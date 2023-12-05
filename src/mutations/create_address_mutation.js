import {graphql, commitMutation} from 'react-relay';

const createAddressMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation createAddressMutation($input: CreateAddressInput!) {
        createAddress(input: $input) {
          success
          errors {
            message
          }
          address {
            id
          }
        }
      }`,
      variables: {
        input: params,
      },
      updater: (store, {createAddress: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer) {
          return;
        }

        const {
          address1,
          address2,
          careOf,
          city,
          country,
          name,
          postalCode,
          state,
        } = params;

        if (payload.address?.id) {
          const addressRecord = store.get(payload.address?.id);

          if (addressRecord) {
            addressRecord.setValue(address1, 'address1');
            addressRecord.setValue(address2, 'address2');
            addressRecord.setValue(careOf, 'careOf');
            addressRecord.setValue(city, 'city');
            addressRecord.setValue(country, 'country');
            addressRecord.setValue(name, 'name');
            addressRecord.setValue(postalCode, 'postalCode');
            addressRecord.setValue(state, 'state');
          }

          const addressesRecords = viewer.getLinkedRecords('addresses');
          if (addressesRecords) {
            addressesRecords.unshift(addressRecord);
            viewer.setLinkedRecords(addressesRecords, 'addresses');
          }
        }

        const sellerSettings = viewer.getLinkedRecord('sellerSettings');
        if (!sellerSettings) {
          return;
        }

        const address = sellerSettings.getOrCreateLinkedRecord('address');
        if (!address) {
          return;
        }

        address.setValue(address1, 'address1');
        address.setValue(address2, 'address2');
        address.setValue(careOf, 'careOf');
        address.setValue(city, 'city');
        address.setValue(country, 'country');
        address.setValue(name, 'name');
        address.setValue(postalCode, 'postalCode');
        address.setValue(state, 'state');
      },
      onError: reject,
      onCompleted: ({createAddress: payload}) => {
        if (payload?.success) {
          resolve(payload?.address);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default createAddressMutation;
