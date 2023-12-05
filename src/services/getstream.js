import {Platform} from 'react-native';
import {StreamChat} from 'stream-chat';
import Config from 'react-native-config';

import {showErrorAlert, decodeId} from 'utils';
import {
  analyticsEvents,
  analyticsSendEvent,
} from 'services';

export const chatClient = StreamChat.getInstance(Config.GET_STREAM_API_KEY);

export const addGetStreamDevice = async (userId, token) => {
  const pushProvider = Platform.select({
    ios: 'apn',
    android: 'firebase',
  });

  if (userId && token) {
    try {
      await chatClient.addDevice(token, pushProvider, `${userId}`);
    } catch (error) {
      console.log(error);
    }
  }
};

export const removeGetStreamDevice = async (userId, token) => {
  if (userId && token) {
    try {
      await chatClient.removeDevice(token, `${userId}`);
    } catch (error) {
      console.log(error);
    }
  }

  if (chatClient.userID) {
    try {
      await chatClient.disconnectUser();
    } catch (error) {
      console.log(error);
    }
  }
};

export const createMessageChannel = async ({
  navigation,
  channel = null,
  currentUserId,
  peerUserId,
  cardId = null,
  isRootScreen = false,
  isFromModal = false,
}) => {
  if (
    !currentUserId ||
    !peerUserId ||
    currentUserId === peerUserId ||
    !chatClient ||
    !chatClient.userID
  ) {
    return null;
  }

  let newChannel = channel;

  try {
    if (!newChannel || !Object.keys(newChannel).length) {
      newChannel = chatClient.channel('messaging', {
        members: [`${currentUserId}`, `${peerUserId}`],
      });

      if (!newChannel) {
        return null;
      }

      await newChannel.watch({ presence: true });
      await newChannel.create();
    }

    if (isRootScreen) {
      navigation.navigate('MessageScreens', {
        screen: 'Message',
        params: {channel: newChannel, peerUserId, cardId},
      });
    } else {
      navigation.navigate('Message', {channel: newChannel, peerUserId, cardId, isFromModal});
    }

    return newChannel;
  } catch (error) {
    console.log(error);
    if (error.message) {
      showErrorAlert(error.message);
    }
  }

  return null;
};

export const getMessageChannel = async (currentProfileId, peerProfileId, tradingCardId) => {
  try {
    const [, currentUserId] = decodeId(currentProfileId);
    const [, peerUserId] = decodeId(peerProfileId);

    let cardId = null;
    if (tradingCardId) {
      const [, tempCardId] = decodeId(tradingCardId);
      cardId = tempCardId;
    }

    if (!chatClient || !chatClient.userID) {
      throw new Error('User is not set on client. Please try again later.');
    }

    const channel = chatClient.channel('messaging', {
      members: [`${currentUserId}`, `${peerUserId}`],
    });

    await channel.watch({ presence: true });
    await channel.create();

    return {
      channel,
      // card,
      // cardUser
      peerUserId,
      cardId,
    };
  } catch (error) {
    console.log(error);
    throw(error?.message);
  }
};

export const findMessageChannels = async (currentProfileId, peerProfileId) => {
  try {
    if (!currentProfileId || !peerProfileId) {
      return [];
    }

    const [, currentUserId] = decodeId(currentProfileId);
    const [, peerUserId] = decodeId(peerProfileId);

    if (!chatClient || !chatClient.userID) {
      return [];
    }

    const filterConditions = {
      type: 'messaging',
      members: [`${currentUserId}`, `${peerUserId}`],
    };

    const channels = await chatClient.queryChannels(filterConditions);

    return channels;
  } catch (error) {
    console.log(error);
    throw(error?.message);
  }
};

export const isExistChannel = async (currentProfileId, peerProfileId) => {
  try {
    const channels = await findMessageChannels(currentProfileId, peerProfileId);
    return channels.length > 0;
  } catch (error) {
    console.log(error);
  }

  return false;
};

export const hideChannel = async (channel) => {
  if (!channel) {
    return;
  }

  try {
    await channel.hide(null, true);
  } catch (error) {
    console.log(error);
  }
};

export const sendMessageToChatBot = async ({
  navigation,
  profileId,
  canonicalCard,
  message,
  isFromModal,
  source, // For analytics
}) => {
  try {
    if (profileId) {
      const [, userId] = decodeId(profileId);

      const channel = await createMessageChannel({
        navigation,
        currentUserId: userId,
        peerUserId: Config.COLLX_AI_BOT_USER_ID,
        isFromModal,
      });

      if (!channel) {
        return;
      }

      let textMessage = null;

      if (message) {
        textMessage = message;
      } else if (canonicalCard) {
        textMessage = `Tell me about the #${canonicalCard.number} ${canonicalCard.name} card in the set ${canonicalCard.set.name}`;
      }

      if (textMessage) {
        channel.sendMessage({
          text: textMessage,
        });
      }

      if (source) {
        analyticsSendEvent(
          analyticsEvents.promptedAI,
          {
            prompt: textMessage,
            from: source,
          },
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
