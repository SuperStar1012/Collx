import React, {useState} from 'react';
import {Animated, TextInput, Keyboard} from 'react-native';
import PropTypes from 'prop-types';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';

export const commentHeight = 56;

const CommentInput = props => {
  const {style, placeholder, onSend} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [comment, setComment] = useState('');

  const handleSend = () => {
    if (!comment) {
      return;
    }

    Keyboard.dismiss();
    onSend(comment);
    setComment('');
  };

  return (
    <Animated.View style={[styles.container, style]}>
      <TextInput
        style={styles.textInputComment}
        autoFocus
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderText}
        value={comment}
        returnKeyType="send"
        underlineColorAndroid="transparent"
        onChangeText={setComment}
        onSubmitEditing={handleSend}
      />
      <Button
        style={styles.sendButton}
        labelStyle={styles.textSend}
        label="Send"
        disabled={!comment}
        scale={Button.scaleSize.Four}
        onPress={handleSend}
      />
    </Animated.View>
  );
};

CommentInput.defaultProps = {
  placeholder: 'Leave a comment',
  onSend: () => {},
};

CommentInput.propTypes = {
  placeholder: PropTypes.string,
  onSend: PropTypes.func,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: commentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.secondaryCardBackground,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  textInputComment: {
    flex: 1,
    height: 32,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sendButton: {
    width: 70,
    height: 32,
    borderRadius: 10,
    marginLeft: 9,
    backgroundColor: colors.primary,
  },
  textSend: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
  },
}));

export default CommentInput;
