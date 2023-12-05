import {graphql, commitMutation} from 'react-relay';

const likeTradingCardMutation = (
  environment,
  tradingCardId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation likeTradingCardMutation($input: LikeInput!) {
        like(input: $input) {
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
        const likeCount = likes.getValue('totalCount');
        likes.setValue((likeCount ?? 0) + 1, 'totalCount');

        const viewer = tradingCard.getLinkedRecord('viewer');
        viewer.setValue(true, 'isLikedByMe');
      },
      onError: reject,
      onCompleted: ({like: payload}) => {
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

export default likeTradingCardMutation;
