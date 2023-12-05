import React from 'react';
import {
  View,
  Switch,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, createUseStyle, useTheme} from 'theme';

const CustomSwitch = props => {
  const {style, labelStyle, label, value, onChangedValue} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.textLabel, labelStyle]}>{label}</Text> : null}
      <Switch
        trackColor={{false: Colors.moreLightGray, true: colors.primary}}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.white}
        onValueChange={onChangedValue}
        value={value}
      />
    </View>
  );
};

CustomSwitch.defaultProps = {
  value: false,
  onChangedValue: () => {},
};

CustomSwitch.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
  onChangedValue: PropTypes.func,
};

export default CustomSwitch;

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
    color: colors.primaryText,
  },
}));
