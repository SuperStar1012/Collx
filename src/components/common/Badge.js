import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, Fonts, createUseStyle} from 'theme';

const Badge = props => {
  const {style, textStyle, label} = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.textBadgeNumber, textStyle]}>{label}</Text>
    </View>
  );
};

Badge.defaultProps = {
  textStyle: {},
};

Badge.propTypes = {
  label: PropTypes.any.isRequired,
};

export default Badge;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 18,
    paddingHorizontal: 8,
    borderRadius: 13,
    marginHorizontal: 4,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBadgeNumber: {
    fontSize: 12,
    fontWeight: Fonts.bold,
    color: Colors.white,
    letterSpacing: -0.004,
  },
}));
