import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {getCount, getPrice} from 'utils';

export const sportTypeListItemHeight = 60;

// TODO: Remove later, doesn't use now.
const CardTypeListItem = props => {
  const {style, label, count, price, isActive, onPress} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const value = `${getCount(count)} ${count > 1 ? 'Items' : 'Item'}, ${getPrice(
    price,
  )} Value`;

  const color = isActive ? colors.primary : colors.primaryText;
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <Text style={[styles.textTypeLabel, {color}]}>{label}</Text>
      <Text style={styles.textTypeValue}>{value}</Text>
    </TouchableOpacity>
  );
};

CardTypeListItem.defaultProps = {
  items: 0,
  price: 0,
  isActive: false,
  onPress: () => {},
};

CardTypeListItem.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.number,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isActive: PropTypes.bool,
  onPress: PropTypes.func,
};

export default CardTypeListItem;

const useStyle = createUseStyle(({colors}) => ({
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
  textTypeValue: {
    fontSize: 12,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginTop: 4,
  },
}));
