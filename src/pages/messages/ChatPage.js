import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Channel,
  MessageInput,
  MessageList,
  useMessageInputContext,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';
import Config from 'react-native-config';

import {
  NavBarButton,
  Button,
  LoadingIndicator,
  FooterIndicator,
  NavUserTitle,
  KeyboardAvoidingScrollView,
} from 'components';
import UserItem from './components/UserItem';
import CardButton from './components/chat/CardButton';
import CustomMessage from './components/chat/CustomMessage';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants} from 'globals';
import {Colors, createUseStyle} from 'theme';
import {withMessage} from 'store/containers';
import {chatClient} from 'services';
import {encodeId, getPeerUser} from 'utils';
import {usePrevious} from 'hooks';

import {
  ChatDarkTheme,
  ChatLightTheme,
  MyMessageTheme,
} from 'theme';
import {useSelector} from 'react-redux';

const sendButton = require('assets/icons/more/send_button.png');
const sendDisable = require('assets/icons/more/send_disable.png');
const moreOptionsButton = require('assets/icons/more/more_options_button.png');
const attachButton = require('assets/icons/more/attach_button.png');

const ChatPage = props => {
  const {navigation} = props;

  const styles = useStyle();

  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
  };

  return (
    <ActionContext.Provider value={actions}>
      <View style={styles.container}>
        <ChatContent
          {...props}
        />
      </View>
    </ActionContext.Provider>
  );
};

const ChatContent = ({
  navigation,
  route,
  isFetching,
  user,
  users,
  userCardDetails,
  connectedChatClient,
  getUsers,
  getUserCard,
}) => {
  const {channel, cardId, peerUserId, isFromModal} = route?.params || {};

  const {closePicker} = useAttachmentPickerContext();

  const appearanceMode = useSelector(state => state.user.appearanceMode);
  const ChatTheme = appearanceMode === Constants.appearanceSettings.on ? ChatDarkTheme : ChatLightTheme;

  const styles = useStyle();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const actions = useActions();

  const [chatPeerUser, setChatPeerUser] = useState({});
  const [searchName, setSearchName] = useState('');
  const [currentChannel, setCurrentChannel] = useState(channel);
  const [selectedThread, setSelectedThread] = useState(null);

  const offsetRef = useRef(0);
  const searchNameRef = useRef(null);

  const prevProps = usePrevious({userCard: userCardDetails[cardId]});

  useEffect(() => {
    if (!channel) {
      getInitialUsers();
    }
  }, []);

  useEffect(() => {
    setNavigationBar();
  }, [chatPeerUser, searchName]);

  useEffect(() => {
    if (!currentChannel) {
      return;
    }

    const {members} = currentChannel.state || {};
    const peerMember = getPeerUser(members, user.id);

    if (peerMember) {
      setChatPeerUser({
        id: peerMember.id,
        name: peerMember.name,
        image: peerMember.image,
      });
    }
  }, [currentChannel]);

  useEffect(() => {
    if (!cardId) {
      return;
    }

    if (!userCardDetails[cardId]) {
      getUserCard({userId: peerUserId, userCardId: cardId});
    } else if (!prevProps?.userCard && userCardDetails[cardId]) {
      sendCard(userCardDetails[cardId]);
    }
  }, [cardId, userCardDetails[cardId]]);

  useFocusEffect(
    useCallback(() => {
      setSelectedThread(null);
    }, [])
  );

  const setNavigationBar = () => {
    navigation.setOptions({
      headerTitle: () => (
        <NavUserTitle
          userId={chatPeerUser.id}
          name={chatPeerUser.name}
          avatarUri={chatPeerUser.image}
          onChangeName={handleSearchUser}
        />
      ),
      headerRight: () => {
        const aiUserId = Config.COLLX_AI_BOT_USER_ID;
        const supportUserId = Config.COLLX_SUPPORT_USER_ID;

        if (!Object.keys(chatPeerUser).length || chatPeerUser.id === aiUserId || chatPeerUser.id === supportUserId) {
          return null;
        }

        return (
          <NavBarButton
            label="View Profile"
            style={styles.navBarButton}
            labelStyle={styles.textViewProfile}
            scale={Button.scaleSize.One}
            onPress={handleProfile}
          />
        );
      },
    });
  };

  const sendCard = card => {
    if (!currentChannel) {
      return;
    }

    const {
      id,
      userId,
      cardId,
      frontImageUrl,
      set,
      number,
      player,
      name,
      grade,
      condition,
    } = card || {};

    const tradingCard = {
      id,
      userId,
      cardId,
      frontImageUrl,
      set,
      number,
      player,
      name,
      grade,
      condition,
    };

    let peerMember = chatPeerUser;

    if (!peerMember?.id) {
      const {members} = currentChannel.state || {};
      peerMember = getPeerUser(members, user.id);
    }

    currentChannel?.sendMessage({
      text: `${user.name} posted a card into the chat`,
      attachments: [
        {
          type: Constants.streamMessageType.card,
          user: {
            id: peerUserId || peerMember?.id,
            name: peerMember?.name,
            avatarUri: peerMember?.image,
          },
          card: tradingCard,
        },
      ],
    });
  };

  const getInitialUsers = () => {
    offsetRef.current = 0;
    getCurrentUsers();
  };

  const getCurrentUsers = () => {
    if (isFetching || searchName?.startsWith(' ')) {
      return;
    }

    const searchQuery = searchNameRef.current ? {q: searchNameRef.current} : {};

    getUsers({
      offset: offsetRef.current * Constants.defaultFetchLimit,
      limit: Constants.defaultFetchLimit,
      messages: 1,
      ...searchQuery,
    });

    offsetRef.current += 1;
  };

  const handleProfile = () => {
    if (closePicker) {
      closePicker();
    }

    if (chatPeerUser?.id) {
      actions.pushProfile(encodeId(Constants.base64Prefix.profile, chatPeerUser?.id));
    }
  };

  const handleSearchUser = text => {
    searchNameRef.current = text;
    setSearchName(text);

    getInitialUsers();
  };

  const handleSelectUser = async item => {
    setChatPeerUser({
      ...item,
      image: item.avatarImageUrl,
    });

    try {
      const newChannel = chatClient.channel('messaging', {
        members: [`${user.id}`, `${item.id}`],
      });

      await newChannel.watch({ presence: true });
      await newChannel.create();

      setCurrentChannel(newChannel);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendCard = () => {
    if (closePicker) {
      closePicker();
    }

    actions.navigateMessageCardSend({
      channel: currentChannel,
    });
  };

  const handleSelectCard = (selectedCard) => {
    if (!selectedCard?.id) {
      return;
    }

    actions.pushTradingCardDetail(
      encodeId(Constants.base64Prefix.tradingCard, selectedCard.id)
    );
  };

  const handleSelectDeal = (selectedDeal) => {
    if (!selectedDeal?.id) {
      return;
    }

    actions.navigateDeal(selectedDeal.id);
  };

  const handleEndReached = () => {
    getCurrentUsers();
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);

    actions.navigateChatThread({
      channel: currentChannel,
      thread,
      isFromModal,
    });
  };

  const renderItem = (item, index) => (
    <UserItem
      key={index} {...item}
      onPress={() => handleSelectUser(item)}
    />
  );

  const renderCustomMessage = (messageProps) => (
    <CustomMessage
      {...messageProps}
      onSelectCard={handleSelectCard}
      onSelectDeal={handleSelectDeal}
    />
  );

  const renderCardButton = () => (
    <CardButton
      onPress={handleSendCard}
      chatTheme={ChatTheme}
    />
  );

  const renderSendButton = () => {
    const { sendMessage, text } = useMessageInputContext();

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={sendMessage}>
        <Image
          style={[styles.iconCard, { tintColor: text === '' ? ChatTheme.primary : Colors.lightBlue }]}
          source={ text === '' ? sendDisable : sendButton }
        />
      </TouchableOpacity>
    );
  };

  const renderAttachButton = () => {
    const { toggleAttachmentPicker } = useMessageInputContext();

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleAttachmentPicker}>
        <Image
          style={[styles.iconCard, {tintColor: ChatTheme.primary}]}
          source={attachButton}
        />
      </TouchableOpacity>
    );
  };

  const renderMoreOptionsButton = ({ handleOnPress }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOnPress}>
        <Image
          style={[styles.iconCard, {tintColor: Colors.lightBlue}]}
          source={moreOptionsButton}
        />
      </TouchableOpacity>
    )
  };

  const renderFooter = () => (
    <FooterIndicator isLoading={!!users.length && isFetching} />
  );

  const renderContent = () => {
    if (connectedChatClient && currentChannel) {
      const extraOffset = isFromModal ? insets.top + 10 : 0;
      return (
        <Channel
          myMessageTheme={MyMessageTheme}
          channel={currentChannel}
          keyboardVerticalOffset={headerHeight + extraOffset}
          Card={renderCustomMessage}
          CommandsButton={renderCardButton}
          SendButton={renderSendButton}
          thread={selectedThread}
          AttachButton={renderAttachButton}
          MoreOptionsButton={renderMoreOptionsButton}
        >
          <MessageList onThreadSelect={handleSelectThread} />
          <MessageInput />
        </Channel>
      );
    }

    if (!isFetching && !users.length) {
      return <Text style={styles.textNoResult}>No matches found</Text>;
    }

    return (
      <KeyboardAvoidingScrollView
        scrollEventThrottle={10}
        onEndReachedThreshold={0.2}
        onEndReached={handleEndReached}>
        {users.map((item, index) => renderItem(item, index))}
        {renderFooter()}
      </KeyboardAvoidingScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingIndicator isLoading={!users.length && isFetching} />
      {renderContent()}
    </SafeAreaView>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  textNoResult: {
    color: colors.darkGrayText,
    marginVertical: 30,
    textAlign: 'center',
  },
  navBarButton: {
    paddingLeft: 0,
    paddingRight: 16,
    minWidth: 100,
  },
  textViewProfile: {
    fontSize: 16,
  },
  iconCard: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
}));

export default withMessage(ChatPage);
