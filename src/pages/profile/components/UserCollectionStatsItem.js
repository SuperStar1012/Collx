
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const UserCollectionStatsItem = ({
  label,
  value,
  onPress,
}) => {
  const styles = useStyle();

  const RootView = onPress ? TouchableOpacity : View;

  const formatNumber = (value) => {
    let number;
    let res = '';

    if (typeof value === 'string' && /^[0-9]+(?:\.[0-9]+)?$/.test(value)) {
      number = parseFloat(value.replace(/,/g, ''));
    } else if (typeof value === 'string' && /^\$\d+(?:,\d{3})*(\.\d+)?$/.test(value)) {
      number = parseFloat(value.replace(/\$|,/g, ''));
      res = '$';
    } else {
      return value;
    }

    if (number >= 100000)
      res += `${(number / 1000).toFixed(1)}K`;
    else
      return value;
    return res;
  };

  return (
    <RootView
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      {value ? (
        <Text style={styles.textStatisticValue}>
          {formatNumber(value)}
        </Text>
      ) : (
        <Text style={[styles.textStatisticValue, styles.textStatisticValueNone]}>
          -
        </Text>
      )}
      <Text style={styles.textStatisticLabel}>{label}</Text>
    </RootView>
  );
};

export default UserCollectionStatsItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    alignItems: 'center',
  },
  textStatisticValue: {
    fontWeight: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    color: colors.primaryText,
  },
  textStatisticValueNone: {
    color: colors.darkGrayText,
  },
  textStatisticLabel: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
  },
}));
