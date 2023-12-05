import React, {forwardRef} from 'react';
import {BottomTabBarHeightContext} from '@react-navigation/bottom-tabs';

import KeyboardAvoidingView from './KeyboardAvoidingView';

const KeyboardAvoidingSectionList = forwardRef((props, ref) => {

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 100));
    wait.then(() => {
      if (ref) {
        try {
          ref.scrollToLocation({
            sectionIndex: info.sectionIndex,
            itemIndex: info.itemIndex,
            viewPosition: info.viewPosition,
          });
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
          scrollViewComponent="SectionList">
        </KeyboardAvoidingView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
});

KeyboardAvoidingSectionList.defaultProps = {};

KeyboardAvoidingSectionList.propTypes = {};

KeyboardAvoidingSectionList.displayName = 'KeyboardAvoidingSectionList';

export default KeyboardAvoidingSectionList;
