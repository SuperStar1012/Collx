import {graphql, commitMutation} from 'react-relay';

const likeCommentMutation = (
  environment,
  commentId,
) => {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {mutation: graphql`
      mutation likeCommentMutation($input: LikeInput!) {
        like(input: $input) {
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
        likes.setValue((likeCount ?? 0) + 1, 'totalCount');

        const viewer = comment.getLinkedRecord('viewer');
        viewer.setValue(true, 'isLikedByMe');
      },
      onError: reject,
      onCompleted: ({like: payload}) => {
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

export default likeCommentMutation;
