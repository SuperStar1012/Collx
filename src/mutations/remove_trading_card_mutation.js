import {commitLocalUpdate} from 'react-relay';

const removeTradingCardMutation = (
  environment,
  tradingCardId,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        setTimeout(() => {
          store.delete(tradingCardId);
        }, 500);

        resolve(tradingCardId);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default removeTradingCardMutation;
