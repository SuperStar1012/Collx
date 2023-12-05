import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'react-relay';

const removeTradingCardsFromSavedForLaterMutation = (
  environment,
  tradingCardIds,
  isAddToDeal,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation removeTradingCardsFromSavedForLaterMutation($input: RemoveTradingCardsFromSavedForLaterInput!) {
          removeTradingCardsFromSavedForLater(input: $input) {
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
          addToDeal: isAddToDeal,
        },
      },
      updater: (store, {removeTradingCardsFromSavedForLater: payload}) => {
        if (!payload?.success) {
          return;
        }

        // Removes trading cards from Saved For Later
        const viewer = store.getRoot().getLinkedRecord("viewer");

        const savedForLaterListConnection = ConnectionHandler.getConnection(
          viewer,
          'SavedForLaterListQuery_viewer__savedForLater',
        );

        const savedForLaterEdges = savedForLaterListConnection.getLinkedRecords("edges");

        savedForLaterEdges.map((edge) => {
          const savedForLaterNode = edge.getLinkedRecord('node');

          const savedForLaterTradingCardsConnection = ConnectionHandler.getConnection(
            savedForLaterNode,
            'SavedForLaterCardsList_savedForLater__tradingCards',
          );

          tradingCardIds.map((tradingCardId) => {
            const savedForLaterTradingCardsEdges = savedForLaterTradingCardsConnection.getLinkedRecords("edges");

            const index = savedForLaterTradingCardsEdges.findIndex((tradingCardEdge) => {
              const tradingCardNode = tradingCardEdge.getLinkedRecord('node');
              const tradingCardDataId = tradingCardNode.getDataID();
              return tradingCardDataId === tradingCardId;
            });

            if (index > -1) {
              let numberOfTradingCards = savedForLaterNode.getValue('numberOfTradingCards');
              numberOfTradingCards -= 1;
              if (numberOfTradingCards < 0) {
                numberOfTradingCards = 0;
              }

              savedForLaterNode.setValue(numberOfTradingCards, 'numberOfTradingCards');
              ConnectionHandler.deleteNode(savedForLaterTradingCardsConnection, tradingCardId);
            }
          });
        });
      },
      onError: reject,
      onCompleted: ({removeTradingCardsFromSavedForLater: payload}) => {
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

export default removeTradingCardsFromSavedForLaterMutation;
