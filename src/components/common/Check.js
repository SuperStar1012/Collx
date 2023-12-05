import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import Button from './Button';

import {createUseStyle} from 'theme';

const checkIcon = require('assets/icons/check.png');
const helpIcon = require('assets/icons/question_square.png');

const CheckItem = ({
  style,
  labelStyle,
  label,
  description,
  value,
  onChangedValue,
  onHelp,
}) => {

  const styles = useStyle();

  const handleChangeValue = () => {
    if (onChangedValue) {
      onChangedValue(!value);
    }
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={handleChangeValue}>
      <View style={styles.mainContainer}>
        <View style={styles.labelAndHelpContainer}>
          <Text style={[styles.textLabel, labelStyle]}>
            {label}
          </Text>
          {onHelp ? (
            <Button
              style={styles.helpButton}
              iconStyle={styles.iconHelp}
              icon={helpIcon}
              onPress={handleHelp}
            />
          ) : null}
        </View>
        {value ? (
          <Image style={styles.iconCheck} source={checkIcon} />
        ) : null}
      </View>
      {description ? (
        <Text style={styles.textDescription}>
          {description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

CheckItem.defaultProps = {
  disabled: false,
  value: false,
  onChangedValue: () => {},
};

CheckItem.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  value: PropTypes.bool,
  onChangedValue: PropTypes.func,
};

export default CheckItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  mainContainer: {
    flex: 1,
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelAndHelpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  helpButton: {},
  iconHelp: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
  },
  iconCheck: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.grayText,
    marginTop: 6,
  },
}));
