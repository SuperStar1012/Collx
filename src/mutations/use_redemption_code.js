import {graphql, commitMutation} from 'react-relay';

import {getPrice} from 'utils';

const useRedemptionCodeMutation = (
  environment,
  code,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation useRedemptionCodeMutation($input: UseRedemptionCodeInput!) {
        useRedemptionCode(input:$input) {
          success
          errors {
            message
          }
          redemptionCode {
            actions {
              ... on GrantCreditAction {
                credit {
                  amount
                  formattedAmount
                }
              }
            }
          }
        }
      }`,
      variables: {
        input: {
          code,
        },
      },
      updater: (store, {useRedemptionCode: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord("viewer");

        const {redemptionCode} = payload || {};

        if (redemptionCode?.actions?.length) {
          const myMoneyRecord = viewer.getOrCreateLinkedRecord('myMoney');
          const creditRecord = myMoneyRecord.getOrCreateLinkedRecord('credit');
          const creditBalanceRecord = creditRecord.getOrCreateLinkedRecord('balance');

          let creditAmount = creditBalanceRecord.getValue('amount');

          redemptionCode?.actions.map(action => {
            const {credit} = action || {};

            if (credit) {
              creditAmount = Number(credit?.amount || 0) + Number(creditAmount || 0);
              creditBalanceRecord.setValue(creditAmount , 'amount');
              creditBalanceRecord.setValue(getPrice(creditAmount), 'formattedAmount');
            }
          });
        }
      },
      onError: reject,
      onCompleted: ({useRedemptionCode: payload}) => {
        if (payload?.success && payload?.redemptionCode) {
          resolve(payload?.redemptionCode);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default useRedemptionCodeMutation;
