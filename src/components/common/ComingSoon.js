import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const ComingSoon = props => {
  const {style, textStyle} = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.textComingSoon, textStyle]}>Coming Soon</Text>
    </View>
  );
};

ComingSoon.defaultProps = {};

ComingSoon.propTypes = {};

export default ComingSoon;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.comingBackground,
  },
  textComingSoon: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: Fonts.bold,
    letterSpacing: 0.34,
    color: colors.comingText,
  },
}));
