import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const triangleIcon = require('assets/icons/arrow_triangle_down.png');

const NavigationTitle = ({
  style,
  title,
  isOpen,
  isEnabledDropdown,
  onPress,
}) => {
  const styles = useStyle();

  const [animatedContentValue] = useState(new Animated.Value(0));
  const isExpandedList = useRef(isOpen);

  useEffect(() => {
    if (isOpen === isExpandedList.current) {
      return;
    }

    animateContent();
  }, [isOpen]);

  const handlePress = () => {
    onPress();
    animateContent();
  };

  const animateContent = () => {
    isExpandedList.current = !isExpandedList.current;

    Animated.timing(animatedContentValue, {
      toValue: isExpandedList.current ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const animationRotateValue = animatedContentValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      disabled={!isEnabledDropdown}
      onPress={handlePress}>
      <Text style={styles.textTitle} numberOfLines={1}>{title}</Text>
      {isEnabledDropdown ? (
        <Animated.Image
          style={[
            styles.iconTriangle,
            {transform: [{rotate: animationRotateValue}]},
          ]}
          source={triangleIcon}
        />
      ) : null}
    </TouchableOpacity>
  );
};

NavigationTitle.defaultProps = {
  isOpen: false,
  isEnabledDropdown: true,
  onPress: () => {},
};

NavigationTitle.propTypes = {
  isOpen: PropTypes.bool,
  isEnabledDropdown: PropTypes.bool,
  onPress: PropTypes.func,
};

export default NavigationTitle;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textTransform: 'capitalize',
  },
  iconTriangle: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: colors.primaryText,
  },
}));
