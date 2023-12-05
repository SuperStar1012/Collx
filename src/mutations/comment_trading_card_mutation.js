import {commitLocalUpdate, ConnectionHandler} from 'react-relay';

import {encodeId} from 'utils';
import {Constants} from 'globals';

const commentTradingCardMutation = (
  environment,
  values,
) => {
  return new Promise((resolve, reject) => {
    commitLocalUpdate(environment, store => {
      try {
        const {id, parentId, refId, comment, createdAt, user} = values;

        const tradingCardId = encodeId(Constants.base64Prefix.tradingCard, refId);
        const commentId = encodeId(Constants.base64Prefix.cardComment, id);
        const userId = encodeId(Constants.base64Prefix.profile, user.id);

        const newComment = store.create(commentId, 'CardComment');

        newComment.setValue(commentId, 'id');
        newComment.setValue(createdAt, 'at');
        newComment.setValue(comment, 'text');

        const whoRecord = newComment.getOrCreateLinkedRecord('who');
        whoRecord.setValue(user.avatarImageUrl, 'avatarImageUrl');
        whoRecord.setValue(userId, 'id');
        whoRecord.setValue(user.anonymous, 'isAnonymous');
        whoRecord.setValue(user.name, 'name');

        newComment.setLinkedRecords([], 'replies');

        if (parentId) {
          const commentParentId = encodeId(Constants.base64Prefix.cardComment, parentId);

          const tradingCardComment = store.get(commentParentId);

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

        resolve(tradingCardId);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default commentTradingCardMutation;
