import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button} from 'components';

import {createUseStyle} from 'theme';

const closeIcon = require('assets/icons/close.png');
const clockIcon = require('assets/icons/clock.png');

const RecentSearchItem = ({
  style,
  labelStyle,
  label,
  onPress,
  onClearRecent,
}) => {
  const styles = useStyle();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <Image style={[styles.iconCommon, styles.iconRecent]} source={clockIcon} />
      <Text style={[styles.textLabel, labelStyle]} numberOfLines={1}>
        {label}
      </Text>
      <Button
        style={styles.clearButton}
        icon={closeIcon}
        iconStyle={styles.iconCommon}
        scale={Button.scaleSize.Two}
        onPress={onClearRecent}
      />
    </TouchableOpacity>
  );
};

RecentSearchItem.defaultProps = {
  onPress: () => {},
  onClearRecent: () => {},
};

RecentSearchItem.propTypes = {
  onPress: PropTypes.func,
  onClearRecent: PropTypes.func,
};

export default RecentSearchItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  textLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    paddingVertical: 12,
  },
  clearButton: {
    height: '100%',
    paddingHorizontal: 6,
  },
  iconCommon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
  iconRecent: {
    marginRight: 4,
  },
}));
