import {graphql, commitMutation} from 'react-relay';

const setTrackingNumberOnOrderMutation = (
  environment,
  orderId,
  trackingNumber,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation setTrackingNumberOnOrderMutation($input: SetTrackingNumberOnOrderInput!) {
        setTrackingNumberOnOrder(input: $input) {
          success
          errors {
            message
          }
          order {
            state
            stateGroup
            shipmentDetails {
              id
              trackingNumber
            }
            timeline(first: 20) {
              edges {
                node {
                  id
                  createdAt
                  toState
                }
              }
            }
            viewer {
              canChangeTrackingNumber
            }
          }
        }
      }`,
      variables: {
        input: {
          orderId,
          trackingNumber,
        },
      },
      updater: (store, {setTrackingNumberOnOrder: payload}) => {
        if (!payload?.success || !payload?.order?.shipmentDetails) {
          return;
        }

        const orderRecord = store.get(orderId);
        if (!orderRecord) {
          return;
        }

        const shipmentDetailsRecord = orderRecord.getOrCreateLinkedRecord('shipmentDetails');
        if (!shipmentDetailsRecord) {
          return;
        }

        shipmentDetailsRecord.setValue(payload.order.shipmentDetails?.id, 'id');
        shipmentDetailsRecord.setValue(payload.order.shipmentDetails?.trackingNumber, 'trackingNumber');
      },
      onError: reject,
      onCompleted: ({setTrackingNumberOnOrder: payload}) => {
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

export default setTrackingNumberOnOrderMutation;
