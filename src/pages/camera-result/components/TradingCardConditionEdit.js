import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import {Dropdown} from 'components';

import {Constants} from 'globals';
import {createUseStyle} from 'theme';

const TradingCardConditionEdit = ({
  style,
  disabled,
  tradingCard,
  gradingScales,
  onChangedCondition,
}) => {
  const styles = useStyle();

  const tradingCardData = useFragment(graphql`
    fragment TradingCardConditionEdit_tradingCard on TradingCard {
      condition {
        name
        gradingScale {
          name
        }
      }
    }`,
    tradingCard
  );

  // Conditions
  const allConditions = useMemo(() => {
    const conditions = Constants.cardConditions.map(item => ({
      label: item.long,
      value: item.long,
    }));
    conditions.unshift({
      label: 'Unknown',
      value: null,
    });

    return conditions;
  }, []);

  // Grading Scales
  const allGradingScales = useMemo(() => {
    const scales = [
      {
        label: 'Not Graded',
        value: Constants.cardGradingScaleRaw,
      },
    ];

    gradingScales?.map(grader => {
      scales.push({
        label: grader.name,
        value: grader.name,
      });
    });

    return scales;
  }, [gradingScales]);

  const allGrades = useMemo(() => {
    const allGrades = {};

    gradingScales?.map(grader => {
      const newGrades = [];
      grader.conditions.map(scale => {
        newGrades.push({
          label: scale.name,
          value: scale.name,
        });
      });
      allGrades[grader.name] = newGrades;
    });

    return allGrades;
  }, [gradingScales]);

  // Grade
  const [currentGrade, setCurrentGrade] = useState(
    tradingCardData?.condition?.name,
  );

  // Condition
  const [currentCondition, setCurrentCondition] = useState(
    tradingCardData?.condition?.name,
  );

  // Grade Scale
  const [currentGradingScale, setCurrentGradingScale] = useState(
    tradingCardData?.condition?.gradingScale?.name || Constants.cardGradingScaleRaw,
  );

  const [selectedAllGrades, setSelectedAllGrades] = useState(
    allGrades[currentGradingScale] || []
  );

  useEffect(() => {
    // Grade
    setCurrentGrade(tradingCardData?.condition?.name);

    // Condition
    setCurrentCondition(tradingCardData?.condition?.name);

    // Grade Scale
    setCurrentGradingScale(tradingCardData?.condition?.gradingScale?.name || Constants.cardGradingScaleRaw);
  }, [tradingCardData.condition]);

  useEffect(() => {
    updateGrades(currentGradingScale, currentGrade);
  }, [currentGradingScale]);

  const updateGrades = (gradingScale, gradeValue = null) => {
    if (gradingScale === allGradingScales[0].value) {
      setCurrentGrade(null);
      setSelectedAllGrades([]);
      return;
    }

    const newGrades = allGrades[gradingScale] || [];

    if (!gradeValue && newGrades.length) {
      gradeValue = newGrades[0].value;
    }

    setCurrentGrade(gradeValue);
    setSelectedAllGrades(newGrades);
  };

  const handleChangeGradingScale = value => {
    setCurrentGradingScale(value);

    const newGrades = allGrades[value] || [];

    const updatedValue = {};

    if (newGrades.length) {
      updatedValue.condition = {
        name: newGrades[0].value,
      };
    } else {
      updatedValue.condition = null;
    }

    if (onChangedCondition) {
      onChangedCondition(updatedValue);
    }
  };

  const handleChangeGrade = value => {
    setCurrentGrade(value);

    const updatedValue = {};

    updatedValue.condition = {
      name: value,
    };

    if (onChangedCondition) {
      onChangedCondition(updatedValue);
    }
  };

  const handleChangeCondition = value => {
    setCurrentCondition(value);

    const updatedValue = {};

    if (value) {
      updatedValue.condition = {
        name: value,
      };
    } else {
      updatedValue.condition = null;
    }

    if (onChangedCondition) {
      onChangedCondition(updatedValue);
    }
  };

  const renderExtra = () => {
    if (currentGradingScale === allGradingScales[0].value) {
      return (
        <Dropdown
          style={styles.dropdownContainer}
          placeholder="Condition"
          disabled={disabled}
          data={allConditions}
          value={currentCondition}
          onChangedValue={handleChangeCondition}
        />
      );
    }

    return (
      <Dropdown
        style={{
          ...styles.dropdownContainer,
          ...(currentGradingScale ? {} : styles.dropdownBorderContainer),
        }}
        placeholder="Grade"
        disabled={disabled}
        data={selectedAllGrades}
        value={currentGrade}
        onChangedValue={handleChangeGrade}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        style={styles.dropdownContainer}
        placeholder="Not Graded"
        disabled={disabled}
        data={allGradingScales}
        value={currentGradingScale}
        onChangedValue={handleChangeGradingScale}
      />
      {renderExtra()}
    </View>
  );
};

TradingCardConditionEdit.defaultProps = {
  disabled: false,
  onChangedCondition: () => {},
};

TradingCardConditionEdit.propTypes = {
  disabled: PropTypes.bool,
  onChangedCondition: PropTypes.func,
};

export default TradingCardConditionEdit;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  dropdownContainer: {
    width: '48%',
    borderRadius: 4,
  },
  dropdownBorderContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
}));
