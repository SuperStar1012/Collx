import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {CardGrade, CardCondition} from 'components';
import {getCardGradeAndCondition} from 'utils';

const TradingCardConditionAndFlags = ({
  style,
  tradingCard,
}) => {
  const tradingCardData = useFragment(graphql`
    fragment TradingCardConditionAndFlags_tradingCard on TradingCard {
      condition {
        name
        gradingScale {
          name
        }
      }
      card {
        ...on SportCard {
          serialNumber
          sportCardFlags: flags
        }
        ...on GameCard {
          gameCardFlags: flags
        }
      }
    }`,
    tradingCard
  );

  const styles = useStyle();

  const conditionValues = getCardGradeAndCondition(tradingCardData.condition);

  const renderCondition = () => {
    if (conditionValues.grade || !conditionValues.condition) {
      return null;
    }

    return (
      <CardCondition
        style={styles.itemContainer}
        condition={conditionValues.condition}
      />
    );
  };

  const renderFlags = () => {
    const flags = tradingCardData.card?.sportCardFlags || tradingCardData.card?.gameCardFlags;
    const serialNumber = tradingCardData.card?.serialNumber || '';

    if (!flags || !flags.length) {
      return null;
    }

    return flags.map((flag) => (
      <CardCondition
        key={flag}
        style={styles.itemContainer}
        condition={flag?.replace(/_/g, ' ')}
        serialNumber={serialNumber}
      />
    ));
  };

  return (
    <View style={[styles.container, style]}>
      <CardGrade
        style={styles.itemContainer}
        grade={conditionValues.grade}
      />
      {renderCondition()}
      {renderFlags()}
    </View>
  );
};

TradingCardConditionAndFlags.defaultProps = {};

TradingCardConditionAndFlags.propTypes = {};

export default TradingCardConditionAndFlags;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    itemContainer: {
      marginRight: 6,
    },
  });
