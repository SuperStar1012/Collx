import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const checkIcon = require('assets/icons/check.png');

const CategoryItem = ({
  category,
  isActive,
  onPress,
}) => {
  const styles = useStyle();

  const handleSelect = () => {
    if (onPress) {
      onPress(category);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handleSelect}>
      <Image
        style={[styles.iconType, isActive ? styles.iconActive : styles.iconNormal]}
        source={category.icon}
      />
      <Text
        style={[styles.textLabel, isActive ? styles.textLabelActive : styles.textLabelNormal]}
        numberOfLines={1}
      >
        {category.label}
      </Text>
      {isActive ? (
        <Image
          source={checkIcon}
          style={styles.iconCheck}
        />
      ) : null}
    </TouchableOpacity>
  );
};

CategoryItem.defaultProps = {
  onPress: () => {},
};

CategoryItem.propTypes = {
  onPress: PropTypes.func,
};

export default CategoryItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconType: {
    width: 24,
    height: 24,
  },
  iconNormal: {
    tintColor: colors.primaryText,
  },
  iconActive: {
    tintColor: colors.primary,
  },
  textLabel: {
    flex: 1,
    fontSize: 17,
    letterSpacing: -0.004,
    marginHorizontal: 16,
  },
  textLabelNormal: {
    color: colors.primaryText,
    fontFamily: Fonts.nunitoBold,
    fontWeight: Fonts.bold,
  },
  textLabelActive: {
    color: colors.primary,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
  },
  iconCheck: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
}));
