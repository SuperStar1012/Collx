import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import CardGradeAndCondition from './CardGradeAndCondition';
import CardPriceLabel from './CardPriceLabel';

const PriceAndGrade = ({
  style,
  canonicalCard,
  tradingCard,
  conditionName,
}) => {
  const styles = useStyle();

  let priceLabelProps = {};

  if (canonicalCard) {
    priceLabelProps.canonicalCard = useFragment(graphql`
      fragment PriceAndGrade_card on Card {
        ...CardPriceLabel_card
      }`,
      canonicalCard
    );
  } else if (tradingCard) {
    priceLabelProps.tradingCard = useFragment(graphql`
      fragment PriceAndGrade_tradingCard on TradingCard {
        ...CardPriceLabel_tradingCard
        condition {
          ...CardGradeAndCondition_cardCondition
        }
      }`,
      tradingCard
    );
  }

  return (
    <View style={[styles.container, style]}>
      {priceLabelProps.tradingCard ? (
        <CardGradeAndCondition
          style={[styles.itemContainer, styles.itemLeftContainer]}
          condition={priceLabelProps.tradingCard.condition}
        />
      ) : null}
      <CardPriceLabel
        style={styles.itemContainer}
        priceStyle={styles.textPrimary}
        stateStyle={styles.textSecondary}
        conditionName={conditionName}
        isShowIcon
        {...priceLabelProps}
      />
    </View>
  );
};

PriceAndGrade.defaultProps = {};

PriceAndGrade.propTypes = {};

export default PriceAndGrade;

const useStyle = () =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 16,
    },
    itemContainer: {
      flex: 1,
      height: 66,
    },
    itemLeftContainer: {
      marginRight: 10,
    },
    textPrimary: {
      fontSize: 20,
      lineHeight: 24,
      marginTop: 4,
    },
    textSecondary: {
      fontSize: 12,
      lineHeight: 14,
      marginTop: 6,
    },
  });
