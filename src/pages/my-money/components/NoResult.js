import React from 'react';
import {Text, View} from 'react-native';

import {createUseStyle} from 'theme';

const NoResult = props => {
  const {style} = props;

  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textNotFoundTitle}>No Result</Text>
    </View>
  );
};

NoResult.defaultProps = {};

NoResult.propTypes = {};

export default NoResult;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNotFoundTitle: {
    fontSize: 18,
    letterSpacing: 0.35,
    color: colors.darkGrayText,
  },
}));
