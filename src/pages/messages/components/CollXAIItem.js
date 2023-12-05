import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {useFragment, graphql} from 'react-relay';
import moment from 'moment';

import {
  ProBadge,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {Constants} from 'globals';

const aiBotAvatarIcon = require('assets/icons/more/ai_bot_avatar.png');
const chevronIcon = require('assets/icons/chevron_forward.png');

const CollXAIItem = ({
  style,
  aiChannel,
  profile,
  onPress,
}) => {
  const styles = useStyle();

  const profileData = useFragment(graphql`
    fragment CollXAIItem_profile on Profile {
      ...ProBadge_profile
    }`,
    profile,
  );

  const channelListener = useRef(null);
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    if (aiChannel && Object.keys(aiChannel).length) {
      getChannelData();

      unsubscribeChannelListener();

      aiChannel.on('message.new', async (event) => {
        const {message} = event || {};
        if (!message) {
          return;
        }

        setChannelData({
          lastMessageAt: getMessageDate(message.updated_at),
          text: message.text,
        });
      });
    }

    return () => {
      unsubscribeChannelListener();
    }
  }, [aiChannel]);

  const unsubscribeChannelListener = async () => {
    if (channelListener.current) {
      channelListener.current.unsubscribe();
      channelListener.current = null;
    }
  };

  const getMessageDate = date => {
    const diffDays = moment().diff(date, 'days');
    let lastMessageAt = null;

    if (diffDays > 0) {
      lastMessageAt = moment(date).format(Constants.dateFormat)
    } else {
      lastMessageAt = moment(date).format(Constants.timeFormat)
    }

    return lastMessageAt;
  };

  const getChannelData = () => {
    if (!aiChannel || !Object.keys(aiChannel).length) {
      setChannelData(null);
      return;
    }

    const {state} = aiChannel;
    if (!state) {
      setChannelData(null);
      return;
    }

    const {last_message_at, messageSets} = state;

    const lastMessageAt = getMessageDate(last_message_at);

    let text = '';

    if (messageSets?.length) {
      const {messages} = messageSets[0];

      if (messages?.length) {
        const lastMessage = messages[messages?.length - 1];
        if (lastMessage) {
          text = lastMessage.text;
        }
      }
    }

    setChannelData({
      lastMessageAt,
      text,
    });
  };

  const handleOpenAIChat = () => {
    if (onPress) {
      onPress();
    }
  };

  const renderLastMessage = () => {
    if (!aiChannel) {
      return null;
    }

    if (channelData && channelData.text && channelData.lastMessageAt) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[styles.text, styles.textMessage]} numberOfLines={1}>
            {channelData.text}
          </Text>
          <Text style={[styles.text, styles.textTime]}>
            {channelData.lastMessageAt}
          </Text>
        </View>
      );
    }

    return (
      <Text style={[styles.text, styles.textUnlock]}>
        Unlock CollX AI with Pro
      </Text>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleOpenAIChat}>
      <Image
        style={styles.imageAvatar}
        source={aiBotAvatarIcon}
      />
      <View style={styles.contentContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.textName}>CollX AI</Text>
          <ProBadge profile={profileData} isForceVisible />
        </View>
        {renderLastMessage()}
      </View>
      <Image style={styles.iconChevronRight} source={chevronIcon} />
    </TouchableOpacity>
  );
};

CollXAIItem.defaultProps = {
  onPress: () => {},
};

CollXAIItem.propTypes = {
  onPress: PropTypes.func,
};

export default CollXAIItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 63,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryBorder,
    paddingHorizontal: 8,
  },
  imageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    fontSize: 14,
    fontWeight: Fonts.bold,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  textUnlock: {
    color: colors.primary,
    marginTop: 4,
  },
  textMessage: {
    flex: 1,
    color: colors.grayText,
  },
  textTime: {
    marginLeft: 10,
    color: colors.grayText,
  },
  iconChevronRight: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.lightGrayText,
    marginLeft: 7,
  },
}));
