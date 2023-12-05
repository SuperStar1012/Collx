import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import {Image} from 'components';

import {Colors, Fonts} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const MessageItem = ({
  style,
  user,
  text,
  time,
  unread,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.container, style]}
    activeOpacity={0.9}
    onPress={() => onPress()}>
    <View style={styles.unreadContainer}>
      {unread ? <View style={styles.unreadMark} /> : null}
    </View>
    <Image style={styles.imageAvatar} source={user.avatarUri} />
    <View style={styles.mainContentContainer}>
      <View style={styles.topContentContainer}>
        <Text style={styles.textName}>{user.name}</Text>
        <Text style={styles.textMessage}>{time}</Text>
        <Image style={styles.iconChevronRight} source={chevronIcon} />
      </View>
      <Text style={styles.textMessage} numberOfLines={1}>
        {text}
      </Text>
    </View>
  </TouchableOpacity>
);

MessageItem.defaultProps = {
  user: {},
  unread: false,
  onPress: () => {},
};

MessageItem.propTypes = {
  user: PropTypes.object,
  text: PropTypes.string,
  time: PropTypes.string,
  unread: PropTypes.bool,
  onPress: PropTypes.func,
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  unreadContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightBlue,
  },
  imageAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  mainContentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingRight: 16,
    marginLeft: 8,
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  topContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    flex: 1,
    fontSize: 14,
    fontWeight: Fonts.bold,
    letterSpacing: -0.004,
    color: Colors.dark,
  },
  textMessage: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.darkGray,
  },
  iconChevronRight: {
    width: 8,
    height: 13,
    resizeMode: 'contain',
    marginLeft: 7,
  },
});
