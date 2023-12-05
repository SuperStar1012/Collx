import {graphql, commitMutation} from 'react-relay';

const addTradingCardsToSavedForLaterMutation = (
  environment,
  values,
) => {
  const {tradingCardIds, removeFromDeal, dealId} = values;

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation addTradingCardsToSavedForLaterMutation($input: AddTradingCardsToSavedForLaterInput!) {
          addTradingCardsToSavedForLater(input: $input) {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input: {
          tradingCardIds,
          removeFromDeal,
        },
      },
      updater: (store, {addTradingCardsToSavedForLater: payload}) => {
        if (!payload?.success) {
          return;
        }

        if (!dealId || !removeFromDeal) {
          return;
        }

        // Removes trading cards from Deal
        const deal = store.get(dealId);
        const tradingCards = deal.getLinkedRecords('tradingCards');

        const filteredCards = tradingCards.filter((tradingCard) =>
          tradingCardIds.findIndex((tradingCardId) => tradingCard.getDataID() === tradingCardId) === -1
        );

        deal.setLinkedRecords(filteredCards, 'tradingCards');

        tradingCardIds.map((tradingCardId) => {
          const tradingCard = store.get(tradingCardId);
          tradingCard.setValue(null, 'activeDeal');
        });
      },
      onError: reject,
      onCompleted: ({addTradingCardsToSavedForLater: payload}) => {
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

export default addTradingCardsToSavedForLaterMutation;
