import {graphql, commitMutation} from 'react-relay';

const dislikeTradingCardMutation = (
  environment,
  tradingCardId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation dislikeTradingCardMutation($input: DislikeInput!) {
        dislike(input: $input) {
          success
          errors {
            message
          }
          tradingCard {
            id
            viewer {
              isLikedByMe
            }
            likes {
              totalCount
            }
          }
        }
      }`,
      variables: {
        input: {
          tradingCard: {
            id: tradingCardId,
          },
        },
      },
      optimisticUpdater: (store) => {
        const tradingCard = store.get(tradingCardId);

        const likes = tradingCard.getLinkedRecord('likes');
        const likeCount = likes?.getValue('totalCount');
        if(likes)
          likes.setValue((Math.max(0, (likeCount ?? 0) - 1)), 'totalCount');

        const viewer = tradingCard.getLinkedRecord('viewer');
        if(viewer)
          viewer.setValue(false, 'isLikedByMe');
      },
      onError: reject,
      onCompleted: ({dislike: payload}) => {
        if (payload?.success && payload?.tradingCard) {
          resolve(payload.tradingCard);
        } else if (payload?.errors?.length) {
          reject(new Error(payload.errors[0].message || 'Unknown Error'));
        } else {
          reject(new Error('Unknown Error'));
        }
      },
    });
  });
};

export default dislikeTradingCardMutation;
