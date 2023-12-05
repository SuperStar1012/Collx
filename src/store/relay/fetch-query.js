import {graphql, fetchQuery} from 'react-relay';

import RelayEnvironment from 'relay/Environment';

export const getUploadUrlsForUserCard = async (tradingCardId) => {
  return new Promise((resolve, reject) => {
    fetchQuery(
      RelayEnvironment,
      graphql`
        query fetchQueryTradingCardQuery($tradingCardId: ID!) {
          tradingCard(with: {id: $tradingCardId}) {
            id
            viewer {
              frontImageUploadUrl
              backImageUploadUrl
            }
          }
        }
      `,
      {tradingCardId},
    )
    .toPromise()
    .then(response => {
      resolve(response?.tradingCard?.viewer);
    })
    .catch(error => {
      reject(error);
    });
  });
};

export const getUserProfile = async (username) => {
  return new Promise((resolve, reject) => {
    fetchQuery(
      RelayEnvironment,
      graphql`
        query fetchQueryUserProfileQuery($username: String!) {
          profile(with: {username: $username}) {
            id
            email
          }
        }
      `,
      {username},
    )
    .toPromise()
    .then(response => {
      resolve(response?.profile);
    })
    .catch(error => {
      reject(error);
    });
  });
};

export const getBuyerSettings = async () => {
  return new Promise((resolve, reject) => {
    fetchQuery(
      RelayEnvironment,
      graphql`
        query fetchQueryBuyerSettingsQuery {
          viewer {
            buyerSettings {
              stripeDefaultPaymentMethodId
            }
          }
        }
      `,
      {},
    )
    .toPromise()
    .then(response => {
      resolve(response?.viewer?.buyerSettings);
    })
    .catch(error => {
      reject(error);
    });
  });
};
