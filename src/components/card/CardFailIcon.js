import React from 'react';
import {
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, createUseStyle} from 'theme';

const cardSearchFailIcon = require('assets/icons/exclamation_triangle_fill.png');

const CardFailIcon = props => {
  const {style, iconStyle, isNotDetected, isFailed} = props;

  const styles = useStyle();

  if (!isNotDetected && !isFailed) {
    return null;
  }

  const iconMoreStyle = isNotDetected ? styles.iconNotDetect : styles.iconFail;

  return (
    <View style={[styles.container, style]}>
      <Image
        style={[styles.icon, iconMoreStyle, iconStyle]}
        source={cardSearchFailIcon}
      />
    </View>
  );
};

CardFailIcon.defaultProps = {
  isNotDetected: false,
  isFailed: false,
};

CardFailIcon.propTypes = {
  isNotDetected: PropTypes.bool,
  isFailed: PropTypes.bool,
};

export default CardFailIcon;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: colors.warningBackground,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: Colors.yellow,
  },
  iconNotDetect: {
    tintColor: Colors.yellow,
  },
  iconFail: {
    tintColor: Colors.red,
  },
}));
