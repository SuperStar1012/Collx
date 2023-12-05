import {graphql, commitMutation} from 'react-relay';

const setSellerTaxpayerInformationMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setSellerTaxpayerInformationMutation($input: SetSellerTaxpayerInformationInput!) {
        setSellerTaxpayerInformation(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: params,
      },
      updater: (store, {setSellerTaxpayerInformation: payload}) => {
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

        const {
          sellerType,
          ssn,
          tin,
          with: {
            addressId,
          }
        } = params;

        sellerSettings.setValue(sellerType, 'sellerType');
        sellerSettings.setValue(ssn, 'ssn');
        sellerSettings.setValue(tin, 'tin');

        if (!addressId) {
          return;
        }

        const address = sellerSettings.getOrCreateLinkedRecord('address');
        if (!address) {
          return;
        }

        address.setValue(addressId, 'id');
      },
      onError: reject,
      onCompleted: ({setSellerTaxpayerInformation: payload}) => {
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

export default setSellerTaxpayerInformationMutation;
