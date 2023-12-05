import {graphql, commitMutation} from 'react-relay';

const dislikeTradingCardMutation = (
  environment,
  commentId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation dislikeCommentMutation($input: DislikeInput!) {
        dislike(input: $input) {
          success
          errors {
            message
          }
          comment {
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
          comment: {
            id: commentId,
          },
        },
      },
      optimisticUpdater: (store) => {
        const comment = store.get(commentId);

        const likes = comment.getLinkedRecord('likes');
        const likeCount = likes.getValue('totalCount');
        likes.setValue((Math.max(0, (likeCount ?? 0) - 1)), 'totalCount');

        const viewer = comment.getLinkedRecord('viewer');
        viewer.setValue(false, 'isLikedByMe');
      },
      onError: reject,
      onCompleted: ({dislike: payload}) => {
        if (payload?.success && payload?.comment) {
          resolve(payload.comment);
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
