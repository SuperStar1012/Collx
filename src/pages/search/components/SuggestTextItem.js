import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const searchIcon = require('assets/icons/search-bar/search.png');
const chevronIcon = require('assets/icons/chevron_forward.png');

const SuggestTextItem = ({
  style,
  label,
  onPress,
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
      <Image style={styles.iconSearch} source={searchIcon} />
      <Text
        style={styles.textLabel}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Image style={styles.iconCommon} source={chevronIcon} />
    </TouchableOpacity>
  );
};

SuggestTextItem.defaultProps = {
  onPress: () => {},
};

SuggestTextItem.propTypes = {
  onPress: PropTypes.func,
};

export default SuggestTextItem;

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
    fontWeight: Fonts.semiBold,
    paddingVertical: 12,
  },
  iconSearch: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.grayText,
    marginRight: 8,
  },
  iconCommon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
}));
