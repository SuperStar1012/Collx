import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle, useTheme} from 'theme';

export const sportTypeListItemHeight = 48;

const CollectionSportListItem = props => {
  const {style, label, isActive, onPress} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const color = isActive ? colors.primary : colors.primaryText;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <Text style={[styles.textTypeLabel, {color}]}>{label}</Text>
    </TouchableOpacity>
  );
};

CollectionSportListItem.defaultProps = {
  isActive: false,
  onPress: () => {},
};

CollectionSportListItem.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onPress: PropTypes.func,
};

export default CollectionSportListItem;

const useStyle = createUseStyle(() => ({
  container: {
    height: sportTypeListItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTypeLabel: {
    fontFamily: Fonts.nunitoBold,
    fontWeight: Fonts.bold,
    fontSize: 17,
    letterSpacing: -0.004,
  },
}));
