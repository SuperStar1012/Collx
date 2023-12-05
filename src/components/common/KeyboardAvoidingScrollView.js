import React, {useRef, forwardRef} from 'react';
import {
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

import KeyboardAvoidingView from './KeyboardAvoidingView';

import {createUseStyle, useTheme} from 'theme';

const KeyboardAvoidingScrollView = forwardRef((props, ref) => {
  const {
    style,
    contentContainerStyle,
    endReachedThreshold,
    children,
    onEndReached,
    onScroll,
    onRefresh,
    ...otherProps
  } = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const scrollViewContentHeightRef = useRef(0);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = Math.round(
      contentSize.height * endReachedThreshold,
    );

    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (isBottom && scrollViewContentHeightRef.current !== contentSize.height) {
      scrollViewContentHeightRef.current = contentSize.height;
      return true;
    }

    return false;
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleScroll = event => {
    if (onScroll) {
      onScroll(event);
    }

    if (onEndReached) {
      const {nativeEvent} = event;
      if (isCloseToBottom(nativeEvent)) {
        onEndReached();
      }
    }
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <KeyboardAvoidingView
          ref={ref}
          style={[styles.container, style]}
          contentContainerStyle={contentContainerStyle}
          bottomOffset={tabBarHeight || 0}
          scrollEventThrottle={1}
          refreshControl={
            <RefreshControl
              refreshing={false}
              tintColor={colors.primary}
              onRefresh={handleRefresh}
            />
          }
          {...otherProps}
          scrollViewComponent="ScrollView"
          onScroll={handleScroll}>
          {children}
        </KeyboardAvoidingView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
});

KeyboardAvoidingScrollView.defaultProps = {
  endReachedThreshold: 0.2,
};

KeyboardAvoidingScrollView.propTypes = {

  endReachedThreshold: PropTypes.number,
};

KeyboardAvoidingScrollView.displayName = 'KeyboardAvoidingScrollView';

export default KeyboardAvoidingScrollView;

const useStyle = createUseStyle(() => ({
  container: {
    flex: 1,
  },
}));
