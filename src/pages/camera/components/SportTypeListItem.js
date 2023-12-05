import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, Fonts} from 'theme';

export const sportTypeListItemHeight = 50;

const CameraSportTypeListItem = props => {
  const {style, label, icon, isActive, onPress} = props;

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    return (
      <Image
        source={icon}
        style={[styles.iconType, isActive && styles.iconTypeActive]}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={onPress}>
      <View style={styles.titleContainer}>
        {renderIcon()}
        <Text style={[styles.textLabel, isActive && styles.textLabelActive]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

CameraSportTypeListItem.defaultProps = {
  count: 0,
  isActive: false,
  onPress: () => {},
};

CameraSportTypeListItem.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  icon: PropTypes.number,
  isActive: PropTypes.bool,
  onPress: PropTypes.func,
};

export default CameraSportTypeListItem;

const styles = StyleSheet.create({
  container: {
    height: sportTypeListItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconType: {
    width: 16,
    height: 16,
    tintColor: Colors.gray,
    marginRight: 6,
  },
  iconTypeActive: {
    tintColor: Colors.white,
  },
  textLabel: {
    fontFamily: Fonts.nunitoBold,
    fontWeight: Fonts.bold,
    fontSize: 17,
    letterSpacing: -0.004,
    color: Colors.gray,
  },
  textLabelActive: {
    color: Colors.white,
  },
});
