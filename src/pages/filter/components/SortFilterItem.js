import React from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {createUseStyle} from 'theme';

const SortFilterItem = props => {
  const {style, textStyle, title, onPress} = props;

  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={[styles.textButton, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

SortFilterItem.defaultProps = {
  title: '',
  onPress: () => {},
};

SortFilterItem.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
};

export default SortFilterItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 42,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiaryBorder,
  },
  textButton: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.004,
    color: colors.primaryText,
  },
}));
