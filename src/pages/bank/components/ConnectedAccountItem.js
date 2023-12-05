import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Colors, createUseStyle} from 'theme';

const chevronForwardIcon = require('assets/icons/chevron_forward.png');
const exclamationIcon = require('assets/icons/exclamation_circle.png');

const ConnectedAccountItem = ({
  style,
  actionId,
  icon,
  label,
  isAccountError,
  onPress,
}) => {
  const styles = useStyle();

  const handleSelect = () => {
    if (onPress) {
      onPress(actionId);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={handleSelect}
    >
      <View style={styles.contentContainer}>
        <Image style={styles.iconBank} source={icon} />
        <Text style={styles.textValue}>{label}</Text>
      </View>
      {isAccountError ? (
        <Image
          style={styles.iconExclamation}
          source={exclamationIcon}
        />
      ) : null}
      <Image style={styles.iconChevron} source={chevronForwardIcon} />
    </TouchableOpacity>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
    backgroundColor: colors.primaryCardBackground,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBank: {
    width: 24,
    height: 24,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
  iconExclamation: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.red,
    marginHorizontal: 8,
  },
  iconChevron: {
    width: 24,
    height: 24,
    tintColor: colors.grayText,
    resizeMode: 'contain',
  },
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 8,
  },
}));

export default ConnectedAccountItem;
