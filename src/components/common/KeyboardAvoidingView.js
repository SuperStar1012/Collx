import React, {useState, useEffect, forwardRef, useMemo} from 'react';
import {
  Platform,
  Animated,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import PropTypes from 'prop-types';

import {Styles} from 'globals';

const KeyboardAvoidingView = forwardRef((props, ref) => {
  const {
    children,
    style,
    contentContainerStyle,
    scrollViewComponent,
    bottomOffset,
    isInitialKeyboard = false,
    onWillShowKeyboard,
    onWillHideKeyboard,
    ...otherProps
  } = props;

  const initialKeyboardHeight = useMemo(() => {
    if (Platform.OS === 'android' || !isInitialKeyboard) {
      return 0;
    }

    return Keyboard.isVisible() ? Keyboard.metrics()?.height - (bottomOffset || 0) : 0;
  }, [bottomOffset, isInitialKeyboard]);

  const [animatedKeyboardHeight] = useState(new Animated.Value(initialKeyboardHeight));

  useEffect(() => {
    let showSubscription = null;
    let hideSubscription = null;

    if (Platform.OS === 'android') {
      // on only Android
      showSubscription = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardDidShow,
      );
      hideSubscription = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardDidHide,
      );
    } else {
      // on only ios
      showSubscription = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardWillShow,
      );
      hideSubscription = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardWillHide,
      );
    }

    return () => {
      if (showSubscription) {
        showSubscription.remove();
      }

      if (hideSubscription) {
        hideSubscription.remove();
      }
    };
  }, [bottomOffset]);

  const handleKeyboardWillShow = e => {
    Animated.timing(animatedKeyboardHeight, {
      toValue: e.endCoordinates.height - bottomOffset,
      duration: (e && e.duration) || 250,
      useNativeDriver: false,
    }).start();

    onWillShowKeyboard(e);
  };

  const handleKeyboardWillHide = e => {
    Animated.timing(animatedKeyboardHeight, {
      toValue: 0,
      duration: (e && e.duration) || 250,
      useNativeDriver: false,
    }).start();

    onWillHideKeyboard(e);
  };

  const handleKeyboardDidShow = e => {
    Animated.timing(animatedKeyboardHeight, {
      toValue: bottomOffset,
      duration: (e && e.duration) || 250,
      useNativeDriver: false,
    }).start();

    onWillShowKeyboard(e);
  };

  const handleKeyboardDidHide = e => {
    Animated.timing(animatedKeyboardHeight, {
      toValue: 0,
      duration: (e && e.duration) || 250,
      useNativeDriver: false,
    }).start();

    onWillHideKeyboard(e);
  };

  if (scrollViewComponent) {
    const commonProps = {
      keyboardShouldPersistTaps: "handled",
      style: [styles.container, style, {marginBottom: animatedKeyboardHeight}],
      contentContainerStyle: [styles.contentContainer, contentContainerStyle],
    };

    switch (scrollViewComponent) {
      case "ScrollView":
        return (
          <Animated.ScrollView
            ref={ref}
            {...otherProps}
            {...commonProps}>
            {children}
          </Animated.ScrollView>
        );
      case "FlatList":
        if (Platform.OS === 'android') {
          return (
            <BottomSheetScrollView>
              <Animated.FlatList
                ref={ref}
                {...otherProps}
                {...commonProps}>
              </Animated.FlatList>
            </BottomSheetScrollView>
          );
        }
        return (
          <Animated.FlatList
            ref={ref}
            {...otherProps}
            {...commonProps}>
          </Animated.FlatList>
        );
      case "SectionList":
        return (
          <Animated.SectionList
            ref={ref}
            {...otherProps}
            {...commonProps}>
          </Animated.SectionList>
        );
    }
  }

  return (
    <Animated.View
      ref={ref}
      {...otherProps}
      style={[
        styles.container,
        style,
        {marginBottom: animatedKeyboardHeight},
      ]}>
      {children}
    </Animated.View>
  );
});

KeyboardAvoidingView.defaultProps = {
  bottomOffset: Styles.screenSafeBottomHeight,
  onWillShowKeyboard: () => {},
  onWillHideKeyboard: () => {},
};

KeyboardAvoidingView.propTypes = {
  scrollViewComponent: PropTypes.string,
  children: PropTypes.any,
  bottomOffset: PropTypes.number,
  onWillShowKeyboard: PropTypes.func,
  onWillHideKeyboard: PropTypes.func,
};

KeyboardAvoidingView.displayName = 'KeyboardAvoidingView';

export default KeyboardAvoidingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
