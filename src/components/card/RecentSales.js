import React, {useCallback, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import _ from 'lodash';

import RecentTransactions from './RecentTransactions';
import RecentListings from './RecentListings';
import PriceAndGrade from './PriceAndGrade';
import GradingScaleList from './GradingScaleList';
import GradeList from './GradeList';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const RecentSales = ({
  style={},
  flag=true,
  card,
  tradingCardIdForIssue,
}) => {

  const styles = useStyle();

  const queryCard = useFragment(graphql`
    fragment RecentSales_card on Card {
      year
      number
      set {
        name
      }
      ...on SportCard {
        player {
          name
        }
      }
      recentSales {
        byCondition {
          condition {
            name
            gradingScale {
              name
            }
          }
          ...RecentTransactions_sales
        }
      }
      ...RecentTransactions_card
      ...RecentListings_card
      ...PriceAndGrade_card,
    }`,
    card
  );

  const [gradingScaleIndex, setGradingScaleIndex] = useState(0);
  const [gradingScaleNames, setGradingScaleNames] = useState([]);
  const [gradeIndex, setGradeIndex] = useState(0);
  const [gradeNames, setGradeNames] = useState([]);
  const [conditionGroup, setConditionGroup] = useState([]);

  useEffect(() => {
    const conditions = groupByConditions();
    const gradingScaleNames = [];
    const gradeNames = [];

    if (!conditions?.length) {
      setGradingScaleIndex(0);
      setGradeNames(gradeNames);
      setGradingScaleNames(gradingScaleNames);
      setConditionGroup(conditions);
      return;
    }

    conditions.map(scale => {
      gradingScaleNames.push(scale.name);

      const names = [];
      scale?.data.map(grade => {
        if (grade.condition.gradingScale.name !== Constants.cardGradingScaleRaw) {
          names.push(grade.condition.name);
        }
      });

      if (names.length) {
        gradeNames.push(names);
      } else {
        // For RAW / conditions
        Constants.cardConditions.map((condition) => {
          names.push(condition.abbreviation);
        });
        gradeNames.push(names);
      }
    });

    checkDefaultGradeName(gradingScaleNames[0], 0, gradeNames);
    setGradingScaleIndex(0);
    setGradeNames(gradeNames);
    setGradingScaleNames(gradingScaleNames);
    setConditionGroup(conditions);
  }, [queryCard?.recentSales?.byCondition]);

  const groupByConditions = useCallback(() => {
    const byCondition = queryCard?.recentSales?.byCondition;
    return _(byCondition)
      .groupBy(item => item.condition?.gradingScale?.name)
      .map((value, key) => ({
        name: key,
        data: value,
      }))
      .sortBy(group => byCondition.indexOf(group[0]))
      .value();
  }, [queryCard?.recentSales?.byCondition]);

  const checkDefaultGradeName = (scaleName, scaleIndex, gradeNames) => {
    let gradeVgIndex = -1;
    if (scaleName === Constants.cardGradingScaleRaw) {
      gradeVgIndex = gradeNames[scaleIndex]?.indexOf(Constants.cardConditions[2].abbreviation);
    }

    setGradeIndex(gradeVgIndex > -1 ? gradeVgIndex : 0);
  };

  const handleGradingScale = scale => {
    const scaleIndex = gradingScaleNames.indexOf(scale);
    setGradingScaleIndex(scaleIndex);
    checkDefaultGradeName(gradingScaleNames[scaleIndex], scaleIndex, gradeNames);
  };

  const handleSelectGrade = grade => {
    setGradeIndex(gradeNames[gradingScaleIndex].indexOf(grade));
  };

  if (!conditionGroup?.length) {
    return (
      <View style={style}>
        <PriceAndGrade
          canonicalCard={queryCard}
          conditionName={Constants.cardConditions[2].long}
        />
      </View>
    );
  }

  let byCondition = null;
  let gradeName;

  if (gradingScaleNames[gradingScaleIndex] === Constants.cardGradingScaleRaw) {
    // RAW
    const abbreviationName = gradeNames[gradingScaleIndex] && gradeNames[gradingScaleIndex][gradeIndex];
    gradeName = Constants.cardConditions.find((condition) => condition.abbreviation === abbreviationName)?.long;
    byCondition = conditionGroup[gradingScaleIndex]?.data.find(condition => condition.condition?.name === gradeName);
  } else {
    gradeName = gradeNames[gradingScaleIndex] && gradeNames[gradingScaleIndex][gradeIndex];
    byCondition = conditionGroup[gradingScaleIndex]?.data[gradeIndex];
  }

  return (
    <View style={style}>
      {flag === false ? (
        <View style={styles.headerContainer}>
          <Text style={styles.textTitle}>Recent Transactions</Text>
        </View>
      ) : null}
      <GradingScaleList
        gradingScales={gradingScaleNames}
        currentGradingScale={gradingScaleNames[gradingScaleIndex]}
        onSelect={handleGradingScale}
      />
      <GradeList
        grades={gradeNames[gradingScaleIndex]}
        currentGrade={gradeNames[gradingScaleIndex][gradeIndex]}
        onSelect={handleSelectGrade}
      />
      {flag ? (
        <PriceAndGrade
          canonicalCard={queryCard}
          conditionName={byCondition?.condition?.name || gradeName}
        />
      ) : null}
      {byCondition ? (
        <RecentTransactions
          flag={flag}
          byCondition={byCondition}
          card={queryCard}
          gradeName={gradeName}
          tradingCardIdForIssue={tradingCardIdForIssue}
        />
      ) : null}
      {flag ? (
        <RecentListings
          card={queryCard}
          gradeName={gradeName}
        />
      ) : null}
    </View>
  );
};

export default RecentSales;

const useStyle = createUseStyle(({colors}) => ({
  headerContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
}));