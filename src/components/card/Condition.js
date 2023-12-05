import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import CardGrade from './CardGrade';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const Condition = props => {
  const {style, grade, condition} = props;

  const styles = useStyle();

  const conditionItem = Constants.cardConditions.find(
    item => item.abbreviation === condition || item.long === condition,
  );

  return (
    <View style={[styles.container, style]}>
      <CardGrade grade={grade} />
      {conditionItem ? (
        <View style={styles.conditionContainer}>
          <Text style={styles.textCondition}>{conditionItem.long}</Text>
        </View>
      ) : null}
    </View>
  );
};

Condition.defaultProps = {};

Condition.propTypes = {
  condition: PropTypes.string,
  grade: PropTypes.string,
};

export default Condition;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionContainer: {
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.conditionBackground,
  },
  textCondition: {
    fontWeight: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.004,
    color: colors.primary,
  },
}));
