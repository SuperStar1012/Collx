import {useEffect, useRef} from 'react';
import {graphql, useFragment} from 'react-relay';

import {withMessage} from 'store/containers';
import {chatClient} from 'services';
import {showErrorAlert, decodeId} from 'utils';
import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';
import {Constants} from 'globals';

const MessageProvider = ({
  user,
  profile,
  setUnreadCount,
  setChatClient,
}) => {
  const chatClientListener = useRef(null);

  const profileData = useFragment(
    graphql`
      fragment MessageProvider_profile on Profile {
        id
        name
        avatarImageUrl
        type
      }
    `,
    profile,
  );

  const [, profileId] = decodeId(profileData?.id);
  const userId = profileId || user.id;

  useEffect(() => {
    connectChatUser();

    return () => {
      disconnectChatUser();
    };
  }, []);

  const getUserInfo = () => {
    const chatUser = {
      id: `${userId}`,
      type: profileData?.type || Constants.userType.standard,
    };

    const name = profileData?.name || user.name;
    if (name) {
      chatUser.name = name;
    }

    const avatarImageUrl = profileData?.avatarImageUrl || user.avatarImageUrl;
    if (avatarImageUrl) {
      chatUser.image = avatarImageUrl;
    }

    return chatUser;
  };

  const connectChatUser = async () => {
    if (!userId || !user.streamToken) {
      return;
    }

    try {
      await disconnectChatUser();


      const response = await chatClient.connectUser(
        getUserInfo(),
        // chatClient.devToken(`${userId}`),
        user.streamToken,
      );

      if (response) {
        setChatClient(response);
      }

      if (response?.me?.total_unread_count) {
        setUnreadCount(response?.me?.total_unread_count);
      }

      chatClientListener.current = chatClient.on(event => {
        if (event.total_unread_count !== undefined) {
          setUnreadCount(event.total_unread_count);
        } else if (event.type === 'message.new' && event.channel_id) {
          const currentChannel = chatClient.channel('messaging', event.channel_id);
          const memberIds = Object.keys(currentChannel?.state?.members || {});
          const recipientId = memberIds.find(item => item !== userId);

          if (recipientId) {
            analyticsSendEvent(
              analyticsEvents.sentMessage,
              {
                recipient_id: recipientId,
              },
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
      if (error.message) {
        showErrorAlert(error.message);
      }
    }
  };

  const disconnectChatUser = async () => {
    if (chatClientListener.current) {
      chatClientListener.current.unsubscribe();
      chatClientListener.current = null;
    }

    if (!chatClient.userID) {
      return;
    }

    setChatClient(null);

    await chatClient.disconnectUser();
  };

  return null;
};

export default withMessage(MessageProvider);
