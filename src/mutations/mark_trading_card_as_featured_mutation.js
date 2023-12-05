import {graphql, commitMutation} from 'react-relay';

const markTradingCardAsFeaturedMutation = (
  environment,
  tradingCardIds,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation markTradingCardAsFeaturedMutation($input: MarkTradingCardAsFeaturedInput!) {
          markTradingCardAsFeatured(input: $input) {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input: {
          tradingCards: tradingCardIds,
        },
      },
      updater: (store, {markTradingCardAsFeatured: payload}) => {
        if (!payload?.success) {
          return;
        }

        tradingCardIds.map(tradingCardId => {
          const tradingCard = store.get(tradingCardId);
          if (!tradingCard) {
            return;
          }

          tradingCard.setValue(true, 'featured');
        });
      },
      onError: reject,
      onCompleted: ({markTradingCardAsFeatured: payload}) => {
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

export default markTradingCardAsFeaturedMutation;
