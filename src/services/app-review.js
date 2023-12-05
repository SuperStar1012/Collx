import InAppReview from 'react-native-in-app-review';

import {Constants} from 'globals';
import {getStorageItem, setStorageItem} from 'utils';

export const requestInAppReview = async () => {
  if (!InAppReview.isAvailable()) {
    return;
  }

  const showedInAppReview = await getStorageItem(Constants.showedInAppReview);

  if (showedInAppReview === 'yes') {
    return;
  }

  InAppReview.RequestInAppReview()
    .then((hasFlowFinishedSuccessfully) => {
      if (hasFlowFinishedSuccessfully) {
        setStorageItem(Constants.showedInAppReview, 'yes');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
