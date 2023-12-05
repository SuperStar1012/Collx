import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';

const CardGrade = props => {
  const {style, grade, isRecentGrade, textStyle} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const getBackgroundColor = () => {
    if (!grade || grade === Constants.cardGradingScaleRaw) {
      return isRecentGrade ? colors.secondaryCardBackground : colors.rawConditionBackground;
    } else if (grade.includes(Constants.cardGraders.collx)) {
      return colors.primary;
    }

    return Colors.lightGreen;
  };

  const getTextColor = () => {
    if ((!grade || grade === Constants.cardGradingScaleRaw) && isRecentGrade) {
      return colors.primary;
    }

    return Colors.white;
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: getBackgroundColor()},
        style,
      ]}>
      <Text
        style={[styles.textGrade, {color: getTextColor()}, textStyle]}
        numberOfLines={1}
      >
        {grade || Constants.cardGradingScaleRaw}
      </Text>
    </View>
  );
};

CardGrade.defaultProps = {
  isRecentGrade: false,
};

CardGrade.propTypes = {
  isRecentGrade: PropTypes.bool,
  grade: PropTypes.string,
};

export default CardGrade;

const useStyle = createUseStyle(() => ({
  container: {
    // width: 61,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    borderRadius: 10,
  },
  textGrade: {
    fontWeight: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.004,
  },
}));
