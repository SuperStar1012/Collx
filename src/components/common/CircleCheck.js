import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const checkIcon = require('assets/icons/checkmark_circle_fill.png');

const CircleCheck = ({
  style,
  labelStyle,
  iconStyle,
  label,
  value,
  onChangedValue,
}) => {
  const styles = useStyle();

  const renderCheckIcon = () => {
    if (!value) {
      return <View style={styles.emptyCircle} />;
    }

    return <Image style={[styles.iconCheck, iconStyle]} source={checkIcon} />;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={() => onChangedValue(!value)}>
      <Text style={[styles.textLabel, labelStyle]}>{label}</Text>
      {renderCheckIcon()}
    </TouchableOpacity>
  );
};

CircleCheck.defaultProps = {
  value: false,
  onChangedValue: () => {},
};

CircleCheck.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
  onChangedValue: PropTypes.func,
};

export default CircleCheck;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    fontWeight: Fonts.semiBold,
    color: colors.primaryText,
  },
  iconCheck: {
    width: 30,
    height: 30,
    tintColor: colors.primary,
  },
  emptyCircle: {
    width: 17,
    height: 17,
    borderRadius: 10,
    margin: 6.5,
    borderWidth: 1,
    borderColor: colors.primary,
  },
}));
