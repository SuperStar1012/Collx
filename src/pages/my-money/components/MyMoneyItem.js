import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {createUseStyle} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const MyMoneyItem = ({
  style,
  valueStyle,
  label,
  value,
  route,
  action,
  onPress,
}) => {
  const styles = useStyle();

  const isNavigable = action || route;

  const handlePress = () => {
    if (onPress) {
      onPress({
        action,
        route,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      disabled={!isNavigable}
      onPress={handlePress}>
      <Text style={[styles.textLabel, styles.textTitle]}>{label}</Text>
      <Text style={[styles.textLabel, valueStyle]}>{value}</Text>
      {isNavigable ? <Image style={styles.iconChevronRight} source={chevronIcon} /> : null}
    </TouchableOpacity>
  );
};

MyMoneyItem.defaultProps = {
  onPress: () => {},
};

MyMoneyItem.propTypes = {
  onPress: PropTypes.func,
};

export default MyMoneyItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.primaryCardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  textLabel: {
    fontSize: 17,
    letterSpacing: -0.24,
  },
  textTitle: {
    flex: 1,
    color: colors.primaryText,
  },
  textNumber: {
    color: colors.primary,
  },
  textZero: {
    color: colors.primaryText,
  },
  iconChevronRight: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
}));
