import {graphql, commitMutation, ConnectionHandler} from 'react-relay';

const createCommentMutation = (
  environment,
  text,
  ids,
) => {
  const {
    activityId,
    commentId,
    tradingCardId,
  } = ids;

  const forValues = {};
  if (commentId) {
    forValues.commentId = commentId;
  } else if (tradingCardId) {
    forValues.tradingCardId = tradingCardId;
  } else if (activityId) {
    forValues.activityId = activityId;
  }

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: graphql`
        mutation createCommentMutation($input: CreateCommentInput!) {
          createComment(input: $input) {
            success
            errors {
              message
            }
            comment {
              id
              at
              text
              replies {
                id
              }
              who {
                id
                name
                avatarImageUrl
                isAnonymous
              }
            }
          }
        }
      `,
      variables: {
        input: {
          text,
          for: forValues,
        },
      },
      updater: (store, {createComment: payload}) => {
        if (!payload?.success) {
          return;
        }

        const {activityId, commentId, tradingCardId} = forValues;

        if (activityId) {
          return;
        }

        const newCommentId = payload.comment.id;

        const newComment = store.get(newCommentId);

        if (commentId) {
          const tradingCardComment = store.get(commentId);

          const replies = tradingCardComment.getLinkedRecords('replies') || [];
          tradingCardComment.setLinkedRecords([newComment, ...replies], 'replies');
        } else {
          const tradingCard = store.get(tradingCardId);

          const commentsConnection = ConnectionHandler.getConnection(
            tradingCard,
            'Comments_tradingCard__comments'
          );

          const newCommentEdge = ConnectionHandler.createEdge(
            store,
            commentsConnection,
            newComment,
            'CommentEdge'
          );

          ConnectionHandler.insertEdgeBefore(
            commentsConnection,
            newCommentEdge
          );
        }
      },
      onError: reject,
      onCompleted: ({createComment: payload}) => {
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

export default createCommentMutation;
