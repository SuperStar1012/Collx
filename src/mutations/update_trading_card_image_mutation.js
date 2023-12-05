import {commitLocalUpdate} from 'react-relay';

import {getImageLink} from 'utils';

const updateTradingCardImageMutation = (
  environment,
  tradingCardId,
  values,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const {frontImageUploadUrl, backImageUploadUrl} = values;

        if (!tradingCardId) {
          resolve();
          return;
        }

        const tradingCard = store.get(tradingCardId);

        if (!tradingCard) {
          resolve();
          return;
        }

        if (frontImageUploadUrl) {
          const frontImageUrl = getImageLink(frontImageUploadUrl);
          if (frontImageUrl) {
            tradingCard.setValue(frontImageUrl, 'frontImageUrl');
          }
        }

        if (backImageUploadUrl) {
          const backImageUrl = getImageLink(backImageUploadUrl);
          if (backImageUrl) {
            tradingCard.setValue(backImageUrl, 'backImageUrl');
          }
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default updateTradingCardImageMutation;
