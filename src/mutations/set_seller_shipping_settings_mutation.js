import {graphql, commitMutation} from 'react-relay';

const setSellerShippingSettingsMutation = (
  environment,
  params,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setSellerShippingSettingsMutation($input: SetSellerShippingSettingsInput!) {
        setSellerShippingSettings(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: params,
      },
      updater: (store, {setSellerShippingSettings: payload}) => {

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
          buyerPaysShipping,
          shippingLabelGeneratedBy,
          packingSlip,
          shippingPackageType,
          shippingLabelSize,
          shippingCost,
          shippingInfo,
          minimum,
        } = params;

        sellerSettings.setValue(buyerPaysShipping, 'buyerPaysShipping');
        sellerSettings.setValue(shippingLabelGeneratedBy, 'shippingLabelGeneratedBy');
        sellerSettings.setValue(packingSlip, 'packingSlip');
        sellerSettings.setValue(shippingPackageType, 'shippingPackageType');
        sellerSettings.setValue(shippingLabelSize, 'shippingLabelSize');
        sellerSettings.setValue(shippingCost, 'shippingCost');
        sellerSettings.setValue(shippingInfo, 'shippingInfo');
        sellerSettings.setValue(minimum, 'minimum');
      },
      onError: reject,
      onCompleted: ({setSellerShippingSettings: payload}) => {
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

export default setSellerShippingSettingsMutation;
