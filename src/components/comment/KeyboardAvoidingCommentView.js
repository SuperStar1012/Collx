import React, {useState, useEffect, forwardRef} from 'react';
import {StyleSheet, View, Animated, Platform} from 'react-native';
import PropTypes from 'prop-types';

import KeyboardAvoidingScrollView from '../common/KeyboardAvoidingScrollView';
import CommentInput, {commentHeight} from './CommentInput';

import {Styles} from 'globals';

const KeyboardAvoidingCommentView = forwardRef((props, ref) => {
  const {
    children,
    visibleComment,
    onSendComment,
    onHideComment,
    onWillShowKeyboard,
    onWillHideKeyboard,
    ...otherProps
  } = props;

  const styles = useStyle();

  const [animatedKeyboardHeight] = useState(new Animated.Value(0));
  const [isVisibleComment, setIsVisibleComment] = useState(false);

  useEffect(() => {
    setIsVisibleComment(visibleComment);
  }, [visibleComment]);

  const hideCommentInput = () => {
    if (onHideComment) {
      onHideComment(false);
    }

    setIsVisibleComment(false);
  };

  const handleWillShowKeyboard = e => {
    if (onWillShowKeyboard) {
      onWillShowKeyboard();
    }

    if (Platform.OS === 'android') {
      return;
    }

    Animated.timing(animatedKeyboardHeight, {
      toValue: e.endCoordinates.height - Styles.bottomTabBarHeight,
      duration: (e && e.duration) || 250,
      useNativeDriver: false,
    }).start();
  };

  const handleWillHideKeyboard = e => {
    if (onWillHideKeyboard) {
      onWillHideKeyboard();
    }

    if (Platform.OS === 'android') {
      hideCommentInput();
      return;
    }

    Animated.timing(animatedKeyboardHeight, {
      toValue: 0,
      duration: (e && e.duration) || 250,
      useNativeDriver: false,
    }).start(() => {
      hideCommentInput();
    });
  };

  const handleSendComment = comment => {
    if (onSendComment) {
      onSendComment(comment);
    }

    hideCommentInput();
  };

  const renderCommentInput = () => {
    if (!isVisibleComment) {
      return null;
    }

    return (
      <CommentInput
        style={{bottom: animatedKeyboardHeight}}
        onSend={handleSendComment}
      />
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView
        ref={ref}
        bottomOffset={
          Platform.OS === 'ios'
            ? Styles.bottomTabBarHeight - commentHeight
            : commentHeight
        }
        onWillShowKeyboard={handleWillShowKeyboard}
        onWillHideKeyboard={handleWillHideKeyboard}
        {...otherProps}>
        {children}
      </KeyboardAvoidingScrollView>
      {renderCommentInput()}
    </View>
  );
});

KeyboardAvoidingCommentView.defaultProps = {
  visibleComment: false,
};

KeyboardAvoidingCommentView.propTypes = {
  onSendComment: PropTypes.func,
  onHideComment: PropTypes.func,
};

KeyboardAvoidingCommentView.displayName = 'KeyboardAvoidingCommentView';

export default KeyboardAvoidingCommentView;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
