import {connect} from 'react-redux';

import {emailVerification, card, message} from '../stores';

const mapStateToProps = state => ({
  user: state.user.user,
  isFetching: state.message.isFetching,
  unreadMessageCount: state.message.unreadMessageCount,
  users: state.message.users,
  userCardDetails: state.card.userCardDetails,
  connectedChatClient: state.message.connectedChatClient,
});

const mapDispatchToProps = {
  setUnreadCount: message.actions.setUnreadCount,
  getUsers: message.actions.getUsers,
  getUserCard: card.actions.getUserCard,
  setChatClient: message.actions.setChatClient,
  setEmailVerifiedAction: emailVerification.actions.setEmailVerifiedAction,
};

export default connect(mapStateToProps, mapDispatchToProps);
