import {graphql, commitMutation} from 'react-relay';

const removeTradingCardsFromDealMutation = (
  environment,
  sellerId,
  tradingCardIds,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation removeTradingCardsFromDealMutation($input: RemoveTradingCardsFromDealInput!) {
          removeTradingCardsFromDeal(input: $input) {
            success
            errors {
              message
            }
            deal {
              id
              state
              nextAction
              nextActionDueAt
            }
          }
        }
      `,
      variables: {
        input: {
          with: {
            sellerId,
          },
          tradingCardIds,
        },
      },
      updater: (store, {removeTradingCardsFromDeal: payload}) => {
        if (!payload?.success || !payload.deal) {
          return;
        }

        const deal = store.get(payload.deal.id);

        deal.setValue(payload.deal.state, 'state');

        const tradingCards = deal.getLinkedRecords('tradingCards');

        const filteredCards = tradingCards.filter((tradingCard) =>
          tradingCardIds.findIndex((tradingCardId) => tradingCard.getDataID() === tradingCardId) === -1
        );

        deal.setLinkedRecords(filteredCards, 'tradingCards');

        tradingCardIds.map((tradingCardId) => {
          const tradingCard = store.get(tradingCardId);
          if (tradingCard) {
            tradingCard.setValue(null, 'activeDeal');

            const viewerRecord = tradingCard.getOrCreateLinkedRecord('viewer');
            viewerRecord.setValue(true, 'canAddToDeal');
          }
        });
      },
      onError: reject,
      onCompleted: ({removeTradingCardsFromDeal: payload}) => {
        if (payload?.success && payload?.deal) {
          resolve(payload.deal);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default removeTradingCardsFromDealMutation;
