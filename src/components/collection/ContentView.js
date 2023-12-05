import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {
  KeyboardAvoidingSectionList,
  KeyboardAvoidingScrollView,
  FooterIndicator,
} from 'components';

import {usePrevious} from 'hooks';
import {createUseStyle} from 'theme';

const ContentView = props => {
  const {
    style,
    contentContainerStyle,
    isCollapseView,
    sortLabel,
    filterLabel,
    onScroll,
    onLayout,
    onSetScrollViewRef,
    ...otherProps
  } = props;

  const styles = useStyle();

  const prevProps = usePrevious({sortLabel, filterLabel});

  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (!prevProps || prevProps.sortLabel === sortLabel || prevProps.filterLabel === filterLabel) {
      return;
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false});
    }
  }, [prevProps, sortLabel, filterLabel]);

  const handleScroll = ({nativeEvent}) => {
    if (onScroll) {
      const {contentOffset} = nativeEvent;
      onScroll(contentOffset.y);
    }
  };

  const handleLayout = ({ nativeEvent: {layout} }) => {
    if (onLayout) {
      onLayout(layout);
    }
  };

  if (isCollapseView) {
    return (
      <KeyboardAvoidingScrollView
        ref={ref => {
          scrollViewRef.current = ref;
          if (onSetScrollViewRef) {
            onSetScrollViewRef(ref);
          }
        }}
        style={[styles.container, style]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        onScroll={handleScroll}
        onLayout={handleLayout}
        {...otherProps}
      />
    );
  }

  return (
    <KeyboardAvoidingSectionList
      ref={ref => {
        scrollViewRef.current = ref;
        if (onSetScrollViewRef) {
          onSetScrollViewRef(ref);
        }
      }}
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      ListFooterComponent={<FooterIndicator isLoading={props.refreshing} />}
      onScroll={handleScroll}
      onLayout={handleLayout}
      {...otherProps}
    />
  );
};

ContentView.defaultProps = {
  isCollapseView: false,
  sortLabel: null,
  filterLabel: null,
  onScroll: () => {},
  onLayout: () => {},
  onSetScrollViewRef: () => {},
};

ContentView.propTypes = {
  isCollapseView: PropTypes.bool,
  sortLabel: PropTypes.string,
  filterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onScroll: PropTypes.func,
  onLayout: PropTypes.func,
  onSetScrollViewRef: PropTypes.func,
};

export default ContentView;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  contentContainer: {
    paddingVertical: 8,
  },
}));
