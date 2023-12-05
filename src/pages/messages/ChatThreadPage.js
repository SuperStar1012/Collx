import React from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Channel,
  Thread,
  useAttachmentPickerContext,
  useMessageInputContext,
} from 'stream-chat-react-native';

import CustomMessage from './components/chat/CustomMessage';
import CardButton from './components/chat/CardButton';
import {useSelector} from 'react-redux';

import ActionContext, {useActions, createNavigationActions} from 'actions';
import createActions from './actions';
import {Constants} from 'globals';
import {Colors, createUseStyle} from 'theme';
import {encodeId} from 'utils';

import {
  ChatDarkTheme,
  ChatLightTheme,
  MyMessageTheme,
} from 'theme';

const sendButton = require('assets/icons/more/send_button.png');
const sendDisable = require('assets/icons/more/send_disable.png');
const moreOptionsButton = require('assets/icons/more/more_options_button.png');
const attachButton = require('assets/icons/more/attach_button.png');

const ChatThreadPage = ({
  navigation,
  route,
}) => {
  const {channel, thread, isFromModal} = route?.params || {};

  const appearanceMode = useSelector(state => state.user.appearanceMode);
  const ChatTheme = appearanceMode === Constants.appearanceSettings.on ? ChatDarkTheme : ChatLightTheme;

  const {closePicker} = useAttachmentPickerContext();

  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const styles = useStyle();
  const actions = {
    ...useActions(),
    ...createNavigationActions(navigation),
    ...createActions({navigation}),
  };

  const handleSendCard = () => {
    if (closePicker) {
      closePicker();
    }

    if (channel && thread?.id) {
      actions.navigateMessageCardSend({
        channel,
        parentId: thread.id,
        // showInChannel,
      });
    }
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

  const renderCustomMessage = (messageProps) => (
    <CustomMessage
      {...messageProps}
      onSelectCard={handleSelectCard}
      onSelectDeal={handleSelectDeal}
    />
  );


  const renderCardButton = () => (
    <CardButton onPress={handleSendCard} chatTheme={ChatTheme}/>
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

  const extraOffset = isFromModal ? insets.top + 10  : 0;

  return (
    <ActionContext.Provider value={actions}>
      <SafeAreaView style={styles.container}>
        <Channel
          myMessageTheme={MyMessageTheme}
          channel={channel}
          keyboardVerticalOffset={headerHeight + extraOffset}
          Card={renderCustomMessage}
          CommandsButton={renderCardButton}
          SendButton={renderSendButton}
          thread={thread}
          threadList
          allowThreadMessagesInChannel={false}
          AttachButton={renderAttachButton}
          MoreOptionsButton={renderMoreOptionsButton}
        >
          <Thread />
        </Channel>
      </SafeAreaView>
    </ActionContext.Provider>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
}));

export default ChatThreadPage;
