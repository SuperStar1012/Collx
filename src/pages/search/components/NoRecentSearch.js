import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

import {createUseStyle} from 'theme';

const clockArrowCircleIcon = require('assets/icons/clock_arrow_circle.png');

const NoRecentSearch = ({
  style,
}) => {
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <Image source={clockArrowCircleIcon} style={styles.iconClock} />
      <Text style={styles.textNoRecent}>No Recent Search</Text>
      <Text style={styles.textDescription}>
        Your recent searches will show up here
      </Text>
    </View>
  );
};

NoRecentSearch.defaultProps = {};

NoRecentSearch.propTypes = {};

export default NoRecentSearch;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iconClock: {
    width: 84,
    height: 84,
    tintColor: colors.darkGrayText,
  },
  textNoRecent: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 'bold',
    letterSpacing: 0.35,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginBottom: 9,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
  },
}));
