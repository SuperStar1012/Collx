import React, {useState, forwardRef, useMemo, useRef} from 'react';
import {
  TouchableOpacity,
  Animated,
  Text,
  Easing,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Image from './Image';

import {Colors, createUseStyle} from 'theme';

const comingSoonIcon = require('assets/icons/more/coming_soon.png');

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Button = forwardRef((props, ref) => {
  const {
    style,
    labelStyle,
    iconStyle,
    label,
    icon,
    disabled,
    isComingSoon,
    badge,
    badgeStyle,
    activeColor,
    inactiveColor,
    activeBackgroundColor,
    inactiveBackgroundColor,
    scaleDisabled,
    scale,
    numberOfLines,
    renderIcon,
    renderLabel,
    onPress,
  } = props;

  const styles = useStyle();

  const [animatedScaleValue] = useState(new Animated.Value(1));
  const currentAnimationRef = useRef(null);

  const handlePressIn = () => {
    if (scaleDisabled) {
      return;
    }

    if (currentAnimationRef.current) {
      currentAnimationRef.current.reset();
    } else {
      animatedScaleValue.setValue(1);
    }

    currentAnimationRef.current = Animated.timing(animatedScaleValue, {
      toValue: scale,
      duration: 150,
      easing: Easing.easeOutCirc,
      useNativeDriver: true,
    });

    if (currentAnimationRef.current) {
      currentAnimationRef.current.start(() => {
        currentAnimationRef.current = null;
      });
    }
  };

  const handlePressOut = () => {
    if (scaleDisabled) {
      return;
    }

    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
    } else {
      animatedScaleValue.setValue(scale);
    }

    currentAnimationRef.current = Animated.timing(animatedScaleValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.easeOutCirc,
      useNativeDriver: true,
    });

    if (currentAnimationRef.current) {
      currentAnimationRef.current.start(() => {
        currentAnimationRef.current = null;
      });
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const colorStyles = useMemo(() => {
    let color = {};
    let tintColor = {};
    let borderColor = {};
    let backgroundColor = {};
    let opacity = {opacity: 1};

    if (disabled) {
      if (inactiveColor) {
        color = {color: inactiveColor};
        borderColor= {borderColor: inactiveColor};
        tintColor = {tintColor: inactiveColor};
      }

      if (inactiveBackgroundColor) {
        backgroundColor = {backgroundColor: inactiveBackgroundColor};
      }

      if (!inactiveColor && !inactiveBackgroundColor) {
        opacity = {opacity: 0.5};
      }
    } else if (!disabled) {
      if (activeColor) {
        color = {color: activeColor};
        borderColor= {borderColor: activeColor};
        tintColor = {tintColor: activeColor};
      }

      if (activeBackgroundColor) {
        backgroundColor = {backgroundColor: activeBackgroundColor};
      }
    }

    return {
      color,
      tintColor,
      borderColor,
      backgroundColor,
      opacity,
    };
  }, [
    disabled,
    activeColor,
    inactiveColor,
    activeBackgroundColor,
    inactiveBackgroundColor,
  ]);

  const renderBadge = () => {
    if (!badge) {
      return null;
    }

    return <View style={[styles.badgeDot, badgeStyle]} />;
  };

  const renderLocalLabel = () => (
    <Text
      style={[styles.textLabel, labelStyle, colorStyles.color]}
      numberOfLines={numberOfLines}
    >
      {label}
    </Text>
  );

  const renderLocalIcon = () => (
    <Image
      source={icon}
      style={[styles.icon, iconStyle, colorStyles.tintColor]}
    />
  );

  const renderContent = () => {
    if (props.children) {
      return props.children;
    } else if (renderLabel && icon) {
      return (
        <>
          {renderLocalIcon()}
          {renderLabel()}
        </>
      );
    } else if (label && renderIcon) {
      return (
        <>
          {renderIcon()}
          {renderLocalLabel()}
        </>
      );
    } else if (label && icon) {
      return (
        <>
          {renderLocalIcon()}
          {renderLocalLabel()}
        </>
      );
    } else if (label) {
      return renderLocalLabel();
    } else if (icon) {
      return renderLocalIcon();
    }

    return null;
  };

  return (
    <AnimatedTouchableOpacity
      ref={ref}
      style={[
        styles.container,
        {transform: [{scale: animatedScaleValue}]},
        style,
        colorStyles.borderColor,
        colorStyles.backgroundColor,
        colorStyles.opacity,
      ]}
      activeOpacity={0.9}
      disabled={disabled || isComingSoon}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}>
      {renderContent()}
      {renderBadge()}
      {isComingSoon ? <View style={styles.comingSoonContainer} /> : null}
      {isComingSoon ? (
        <Image style={styles.iconComingSoon} source={comingSoonIcon} />
      ) : null}
    </AnimatedTouchableOpacity>
  );
});

Button.scaleSize = {
  Zero: 1,
  One: 1.025,
  Two: 1.05,
  Three: 1.075,
  Four: 1.1,
  Five: 1.125,
  Six: 1.15,
  Seven: 1.175,
  Eight: 1.2,
};

Button.defaultProps = {
  disabled: false,
  isComingSoon: false,
  badge: false,
  scaleDisabled: false,
  scale: Button.scaleSize.Eight,
  activeColor: null,
  inactiveColor: null,
  activeBackgroundColor: null,
  inactiveBackgroundColor: null,
  numberOfLines: 0,
  renderLabel: null,
  renderIcon: null,
  onPress: () => {},
};

Button.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  renderIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  disabled: PropTypes.bool,
  isComingSoon: PropTypes.bool,
  badge: PropTypes.bool,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  activeBackgroundColor: PropTypes.string,
  inactiveBackgroundColor: PropTypes.string,
  scaleDisabled: PropTypes.bool,
  numberOfLines: PropTypes.number,
  scale: PropTypes.number,
  onPress: PropTypes.func,
};

Button.displayName = 'Button';

export default Button;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 22,
    height: 22,
  },
  textLabel: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  comingSoonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.comingBackground,
  },
  iconComingSoon: {
    position: 'absolute',
    left: 6,
    top: -5,
    width: 49,
    height: 34,
  },
}));
