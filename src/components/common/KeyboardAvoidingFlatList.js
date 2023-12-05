import React, {forwardRef} from 'react';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

import KeyboardAvoidingView from './KeyboardAvoidingView';

const KeyboardAvoidingFlatList = forwardRef((props, ref) => {

  const handleScrollToIndexFailed = info => {
    const wait = new Promise(resolve => setTimeout(resolve, 100));
    wait.then(() => {
      if (ref) {
        try {
          ref.scrollToIndex({index: info.index});
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {tabBarHeight => (
        <KeyboardAvoidingView
          ref={ref}
          bottomOffset={tabBarHeight || 0}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          {...props}
          scrollViewComponent="FlatList">
        </KeyboardAvoidingView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
});

KeyboardAvoidingFlatList.defaultProps = {};

KeyboardAvoidingFlatList.propTypes = {};

KeyboardAvoidingFlatList.displayName = 'KeyboardAvoidingFlatList';

export default KeyboardAvoidingFlatList;
