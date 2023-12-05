import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {ProBadge} from 'components';

import {createUseStyle} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const SettingsItem = ({style, icon, label, value, isProBadge, onPress}) => {
  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <View style={styles.contentContainer}>
        {icon ? <Image style={styles.icon} source={icon} /> : null}
        <Text style={styles.textLabel}>{label}</Text>
        {isProBadge ? <ProBadge isForceVisible /> : null}
      </View>
      {value ? (
        <Text style={[styles.textLabel, styles.textValue]}>{value}</Text>
      ) : null}
      <Image style={styles.iconChevronRight} source={chevronIcon} />
    </TouchableOpacity>
  );
};

SettingsItem.defaultProps = {
  onPress: () => {},
};

SettingsItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.number,
  onPress: PropTypes.func,
};

export default SettingsItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
    marginRight: 12,
  },
  textLabel: {
    fontSize: 17,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textValue: {
    color: colors.grayText,
    textTransform: 'capitalize',
  },
  iconChevronRight: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
}));
