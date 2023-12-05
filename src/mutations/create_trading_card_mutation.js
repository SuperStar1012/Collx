import {graphql, commitMutation} from 'react-relay';
import _ from 'lodash';

const createTradingCardMutation = (
  environment,
  from,
  values,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation createTradingCardMutation($input: CreateTradingCardInput!) {
          createTradingCard(input: $input) {
            success
            errors {
              message
            }
            tradingCard {
              id
              viewer {
                frontImageUploadUrl
                backImageUploadUrl
              }
            }
          }
        }
      `,
      variables: {
        input: {
          from: from,
          with: values,
        },
      },
      updater: (store, {createTradingCard: payload}) => {
        if (!payload?.success) {
          return;
        }

        if (!payload.tradingCard?.id) {
          return;
        }

        const tradingCard = store.get(payload.tradingCard?.id);

        if (!tradingCard) {
          return;
        }

        // if (_.has(values, 'public')) {
        //   tradingCard.setValue(values.public, 'public');
        // }

        if (_.has(values, 'notes')) {
          tradingCard.setValue(values.notes || "", 'notes');
        }

        if (_.has(values, 'purchasePrice')) {
          if (values.purchasePrice) {
            const purchasePriceRecord = tradingCard.getOrCreateLinkedRecord('purchasePrice');
            purchasePriceRecord.setValue(values.purchasePrice.amount, 'amount');
            purchasePriceRecord.setValue(values.purchasePrice.currencyCode, 'currencyCode');
          } else {
            tradingCard.setValue(null, 'purchasePrice');
          }
        }

        if (_.has(values, 'purchaseDate')) {
          tradingCard.setValue(values.purchaseDate, 'purchaseDate');
        }

        if (_.has(values, 'certificationNumber')) {
          tradingCard.setValue(values.certificationNumber, 'certificationNumber');
        }

        if (payload.tradingCard?.condition) {
          const condition = payload.tradingCard?.condition;
          const conditionRecord = tradingCard.getOrCreateLinkedRecord('condition');
          conditionRecord.setValue(condition.name, 'name');
          const gradingScaleRecord = conditionRecord.getOrCreateLinkedRecord('gradingScale');
          gradingScaleRecord.setValue(condition.gradingScale.name, 'name');
        } else {
          tradingCard.setValue(null, 'condition');
        }
      },
      onError: reject,
      onCompleted: ({createTradingCard: payload}) => {
        if (payload?.success && payload?.tradingCard) {
          resolve(payload.tradingCard);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default createTradingCardMutation;
