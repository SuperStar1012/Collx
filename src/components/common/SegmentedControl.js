import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';


import {Colors, Fonts} from 'theme';

const DEFAULT_SPRING_CONFIG = {
  stiffness: 150,
  damping: 20,
  mass: 1,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

const SegmentedControl = (props) => {
  const {
    containerStyle,
    pressableContainer,
    tileStyle,
    activeTextStyle,
    inactiveTextStyle,
    activeIconStyle,
    inactiveIconStyle,
    segmentLabels,
    segmentIcons,
    selectedIndex,
    movingSegmentMargin,
    onChange,
  } = props;

  const segments = segmentLabels.length ? segmentLabels : segmentIcons.length ? segmentIcons : [];

  const [containerWidth, setContainerWidth] = useState(0);
  const translateValue = containerWidth / segments.length;
  const tabTranslateValue = useSharedValue(0);

  const memoizedTabPressCallback = React.useCallback(
    (index) => {
      onChange(index);
    },
    [onChange]
  );

  useEffect(() => {
    tabTranslateValue.value = withSpring(
      selectedIndex * translateValue,
      DEFAULT_SPRING_CONFIG
    );
  }, [selectedIndex, containerWidth]);

  const tabTranslateAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: tabTranslateValue.value }],
  }));

  const handleLayout = ({nativeEvent: {layout}}) => {
    setContainerWidth(layout.width);
  };

  const renderSegment = (segment, index) => {
    if (segmentLabels.length) {
      return (
        <Text
          style={selectedIndex === index
            ? [styles.textActive, activeTextStyle]
            : [styles.textInactive, inactiveTextStyle]
          }
        >
          {segment}
        </Text>
      );
    } else if (segmentIcons.length) {
      return (
        <Image
          style={selectedIndex === index
            ? [styles.iconActive, activeIconStyle]
            : [styles.iconInactive, inactiveIconStyle]
          }
          source={segment}
        />
      );
    }

    return null;
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      onLayout={handleLayout}
    >
      <Animated.View
        style={[
          styles.movingSegment,
          {
            marginVertical: movingSegmentMargin,
            marginHorizontal: movingSegmentMargin,
          },
          tileStyle,
          StyleSheet.absoluteFill,
          {
            width: containerWidth / segments.length - movingSegmentMargin * 2,
          },
          tabTranslateAnimatedStyles,
        ]}
      />
      {segments.map((segment, index) => (
        <Pressable
          onPress={() => memoizedTabPressCallback(index)}
          key={index}
          style={[styles.touchableContainer, pressableContainer]}
        >
          {renderSegment(segment, index)}
        </Pressable>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 1000,
    // backgroundColor: Colors.blackAlpha5,
  },
  touchableContainer: {
    flex: 1,
    elevation: 9,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textActive: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: Fonts.bold,
    textAlign: 'center',
    color: Colors.primary,
  },
  textInactive: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: Colors.whiteAlpha6,
  },
  iconActive: {
    width: 14,
    height: 22,
    resizeMode: 'contain',
    tintColor: Colors.primary,
  },
  iconInactive: {
    width: 14,
    height: 22,
    resizeMode: 'contain',
    tintColor: Colors.whiteAlpha6,
  },
  movingSegment: {
    top: 0,
    borderRadius: 1000,
    backgroundColor: Colors.lightGrayAlpha1,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.025,
    shadowRadius: 1,
    elevation: 1,
  },
});

SegmentedControl.defaultProps = {
  segmentLabels: [],
  segmentIcons: [],
  movingSegmentMargin: 2,
  onChange: () => {},
};

SegmentedControl.propTypes = {
  segmentLabels: PropTypes.array,
  segmentIcons: PropTypes.array,
  selectedIndex: PropTypes.number.isRequired,
  movingSegmentMargin: PropTypes.number,
  onChange: PropTypes.func,
};

export default SegmentedControl;
