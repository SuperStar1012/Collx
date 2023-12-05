import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {CardGrade, CardCondition} from 'components';
import {getCardGradeAndCondition} from 'utils';

const TradingCardCondition = props => {
  const {style} = props;

  const tradingCard = useFragment(graphql`
    fragment TradingCardCondition_tradingCard on TradingCard {
      condition {
        name
        gradingScale {
          name
        }
      }
    }`,
    props.tradingCard
  );

  const styles = useStyle();

  const conditionValues = getCardGradeAndCondition(tradingCard.condition);

  const renderCondition = () => {
    if (conditionValues.grade || !conditionValues.condition) {
      return (
        <CardGrade
          grade={conditionValues.grade}
        />
      );
    }

    return (
      <CardCondition
        textStyle={conditionValues.condition.length > 4 && styles.textCondition}
        condition={conditionValues.condition}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderCondition()}
    </View>
  );
};

TradingCardCondition.defaultProps = {};

TradingCardCondition.propTypes = {};

export default TradingCardCondition;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    textCondition: {
      fontSize: 10,
      lineHeight: 17,
    },
  });
