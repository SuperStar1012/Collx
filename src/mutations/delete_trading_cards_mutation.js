import {graphql, commitMutation} from 'react-relay';
import {ConnectionHandler} from 'react-relay';

const deleteTradingCardsMutation = (
  environment,
  ids,
  filters,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation deleteTradingCardsMutation($input: DeleteTradingCardsInput!) {
          deleteTradingCards(input: $input) {
            success
            errors {
              message
            }
          }
        }
      `,
      variables: {
        input: {
          with: {
            ids,
          },
        },
      },
      updater: (store, {deleteTradingCards: payload}) => {
        if (!payload?.success) {
          return;
        }

        const viewer = store.getRoot().getLinkedRecord('viewer');
        if (!viewer) {
          return;
        }

        const profile = viewer.getLinkedRecord('profile');
        if (!profile) {
          return;
        }

        // Grid in Collection
        const gridViewTradingCardsConnection = ConnectionHandler.getConnection(
          profile,
          'GridView_profile__tradingCards',
          filters,
        );

        if (gridViewTradingCardsConnection) {
          ids.map((tradingCardId) => {
            ConnectionHandler.deleteNode(gridViewTradingCardsConnection, tradingCardId);
          });
        }

        // List in Collection
        const listViewTradingCardsConnection = ConnectionHandler.getConnection(
          profile,
          'ListView_profile__tradingCards',
          filters,
        );

        if (listViewTradingCardsConnection) {
          ids.map((tradingCardId) => {
            ConnectionHandler.deleteNode(listViewTradingCardsConnection, tradingCardId);
          });
        }

        // Collapse in Collection
        const collapseViewTradingCardsConnection = ConnectionHandler.getConnection(
          profile,
          'CollapseView_profile__tradingCards',
          {
            orderBy: ['NEWEST_FIRST'],
            with: filters.with,
          },
        );

        if (collapseViewTradingCardsConnection) {
          ids.map((tradingCardId) => {
            ConnectionHandler.deleteNode(collapseViewTradingCardsConnection, tradingCardId);
          });
        }
      },
      onError: reject,
      onCompleted: ({deleteTradingCards: payload}) => {
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

export default deleteTradingCardsMutation;
