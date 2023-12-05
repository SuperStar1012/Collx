import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const closeIcon = require('assets/icons/close.png');

const Chip = props => {
  const {style, textStyle, label, onDelete} = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.textLabel, textStyle]} numberOfLines={1}>
        {label}
      </Text>
      <TouchableOpacity
        style={[styles.closeButton, style]}
        activeOpacity={0.8}
        onPress={() => onDelete()}>
        <Image style={styles.iconClose} source={closeIcon} />
      </TouchableOpacity>
    </View>
  );
};

Chip.defaultProps = {
  onDelete: () => {},
};

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default Chip;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderRadius: 30,
    paddingVertical: 7,
    paddingLeft: 10,
    margin: 3,
  },
  closeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textLabel: {
    flexShrink: 1,
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.004,
    color: colors.primaryText,
    marginRight: 2,
  },
  iconClose: {
    width: 14,
    height: 14,
    tintColor: colors.primaryText,
  },
}));
