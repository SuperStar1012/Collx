import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';

import {createUseStyle, Fonts, useTheme} from 'theme';

const SetPercent = ({
  style,
  textStyle,
  title,
  borderWidth,
  color,
  unfilledColor,
  count,
  total,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textsContainer}>
        <Text style={[styles.textTitle, textStyle]}>
          {title}
        </Text>
        <Text style={[styles.textCount, textStyle]}>
          ({count}/{total})
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <Progress.Bar
          style={styles.progressBar}
          width={null}
          height={10}
          progress={count / total}
          borderWidth={borderWidth}
          unfilledColor={unfilledColor || colors.secondaryCardBackground}
          color={color || colors.primary}
        />
        <Text style={[styles.textPercent, textStyle]}>
          {`${(count / total * 100).toFixed(2)}%`}
        </Text>
      </View>
    </View>
  );
};

SetPercent.defaultProps = {
  title: null,
  count: 0,
  total: 0,
  borderWidth: 0,
};

SetPercent.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  total: PropTypes.number,
  borderWidth: PropTypes.number,
  color: PropTypes.string,
  unfilledColor: PropTypes.string,
};

export default SetPercent;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    margin: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    marginRight: 6,
  },
  textsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  textCount: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.grayText,
  },
  textPercent: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primary,
  },
}));
