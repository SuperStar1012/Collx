import {graphql, commitMutation} from 'react-relay';

const setSellerAcceptOfferMutation = (
  environment,
  acceptOffer,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setSellerAcceptOfferMutation($input: SetSellerAcceptOfferInput!) {
        setSellerAcceptOffer(input: $input) {
          success
          errors {
            message
          }
        }
      }`,
      variables: {
        input: {
          acceptOffer,
        },
      },
      updater: (store, {setSellerAcceptOffer: payload}) => {
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

        sellerSettings.setValue(acceptOffer, 'acceptOffer');
      },
      onError: reject,
      onCompleted: ({setSellerAcceptOffer: payload}) => {
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

export default setSellerAcceptOfferMutation;
