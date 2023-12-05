import {graphql, commitMutation} from 'react-relay';

const renewDealMutation = (
  environment,
  dealId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation renewDealMutation($input: RenewDealInput!) {
          renewDeal(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              nextAction
              nextActionDueAt
              cancelledBy
              offer {
                madeBy
              }
              order {
                id
                state
                nextAction
                nextActionDueAt
              }
              seller {
                id
                status
                flags
                orderShipmentDetails {
                  hasShippingAddress
                }
              }
              buyer {
                id
              }
              tradingCards {
                id
                state
                listing {
                  askingPrice {
                    amount
                    formattedAmount
                  }
                }
              }
              chargeBreakdown {
                type
                value {
                  amount
                  formattedAmount
                }
              }
              viewer {
                canMakeOffer
              }
            }
          }
        }
      `,
      variables: {
        input: {
          dealId,
        },
      },
      onError: reject,
      onCompleted: ({renewDeal: payload}) => {
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

export default renewDealMutation;
