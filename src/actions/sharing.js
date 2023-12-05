import Share from 'react-native-share';

export function createSharingActions() {
  return {
    shareUrl: (url, {onComplete, onError} = {}) => {
      Share.open({url})
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },

    share: (options, {onComplete, onError} = {}) => {
      Share.open(options)
        .then(() => onComplete && onComplete())
        .catch((error) => onError && onError(error));
    },
  };
}
