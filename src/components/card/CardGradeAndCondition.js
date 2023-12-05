import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay'
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';
import {getCardGradeAndCondition} from 'utils';

const CardGradeAndCondition = props => {
  const {style, gradeStyle, conditionStyle} = props;

  const styles = useStyle();

  const condition = useFragment(graphql`
    fragment CardGradeAndCondition_cardCondition on CardCondition {
      name
      gradingScale {
        name
      }
    }`,
    props.condition
  );

  const values = getCardGradeAndCondition(condition);

  return (
    <View style={[styles.container, style]}>
      <AutoSizeText
        style={[styles.textGrade, gradeStyle]}
        fontSize={gradeStyle?.fontSize || styles.textGrade?.fontSize}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}>
        {values.grade || Constants.cardGradingScaleRaw}
      </AutoSizeText>
      <Text
        style={[styles.textCondition, conditionStyle]}
        numberOfLines={1}
      >
        {values.grade ? 'Graded' : `condition: ${values?.condition || 'unknown'}`}
      </Text>
    </View>
  );
};

CardGradeAndCondition.defaultProps = {};

CardGradeAndCondition.propTypes = {
  condition: PropTypes.object,
};

export default CardGradeAndCondition;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: 88,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  textGrade: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textTransform: 'uppercase',
  },
  textCondition: {
    fontWeight: Fonts.bold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.004,
    color: colors.lightGrayText,
    marginTop: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
}));
