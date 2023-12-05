import {graphql, commitMutation} from 'react-relay';

const clearPendingFlagForTradingCardsMutation = (
  environment,
  tradingCardIds,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation clearPendingFlagForTradingCardsMutation($input: ClearPendingFlagForTradingCardsInput!) {
          clearPendingFlagForTradingCards(input: $input) {
            success
            errors {
              message
            }
            tradingCards {
              id
            }
          }
        }
      `,
      variables: {
        input: {
          ids: tradingCardIds,
        },
      },
      onError: reject,
      onCompleted: ({clearPendingFlagForTradingCards: payload}) => {
        if (payload?.success && payload?.tradingCards) {
          resolve(payload.tradingCards);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default clearPendingFlagForTradingCardsMutation;
