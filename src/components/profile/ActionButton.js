import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const ActionButton = ({
  style,
  iconStyle,
  labelStyle,
  disabled,
  active,
  disabledTintColor,
  icon,
  label,
  onPress,
}) => {

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  let color = colors.primary;
  let backgroundColor = colors.secondaryCardBackground;

  if (disabled) {
    color = colors.lightGrayText;
  } else if (active) {
    color = Colors.white;
    backgroundColor = colors.primary;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, {backgroundColor}]}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={handlePress}>
      <View style={styles.contentContainer}>
        <Image
          style={[styles.icon, iconStyle, !disabledTintColor && {tintColor: color}]}
          source={icon}
        />
        <Text
          style={[styles.textLabel, labelStyle, {color}]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <Image style={styles.iconChevronRight} source={chevronIcon} />
    </TouchableOpacity>
  );
};

ActionButton.defaultProps = {
  disabled: false,
  active: false,
  disabledTintColor: false,
  onPress: () => {},
};

ActionButton.propTypes = {
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  disabledTintColor: PropTypes.bool,
  label: PropTypes.string.isRequired,
  icon: PropTypes.number.isRequired,
  onPress: PropTypes.func,
};

export default ActionButton;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 5,
    backgroundColor: colors.secondaryCardBackground,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  textLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: Fonts.semiBold,
    letterSpacing: -0.24,
    color: colors.primary,
    marginLeft: 11,
  },
  iconChevronRight: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.lightGrayText,
  },
}));
