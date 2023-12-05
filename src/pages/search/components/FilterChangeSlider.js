import React, {useState} from 'react';
import {
  View,
  Text,
} from 'react-native';
import RangeSlider from 'rn-range-slider';

import FilterChangeHeader from './FilterChangeHeader';

import {Styles} from 'globals';
import {Colors, createUseStyle} from 'theme';

const FilterChangeSlider = ({
  filter,
  isChild,
  step = 0.5,
  onApply,
  onBack,
}) => {
  const {
    name,
    ranges: {
      min = 1,
      max = 10,
    },
    lowValue: initialLowValue,
    highValue: initialHighValue,
  } = filter;

  const styles = useStyle();

  const [lowValue, setLowValue] = useState(initialLowValue || min);
  const [highValue, setHighValue] = useState(initialHighValue || max);

  const handleChangeValue = (low, high) => {
    setLowValue(low);
    setHighValue(high);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(name, lowValue, highValue);
    }

    if (onBack) {
      onBack();
    }
  };

  const handleBack = () => {
    if (onApply) {
      onApply(name, lowValue, highValue);
    }

    if (onBack) {
      onBack();
    }
  };

  const renderThumb = () => (
    <View style={styles.thumbContainer} />
  );

  const renderRail = () => (
    <View style={[styles.railContainer, styles.railUnselectedContainer]}>
      {Array.from(Array((max - min) / step ).keys()).map((item) => (
        <View key={item} style={[styles.stepContainer, item >= ((max - min) / step - 1) && styles.lastStepContainer]} />
      ))}
    </View>
  );

  const renderRailSelected = () => (
    <View style={[styles.railContainer, styles.railSelectedContainer]}>
      {Array.from(Array((highValue - lowValue) / step).keys()).map((item) => (
        <View key={item} style={styles.stepContainer} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FilterChangeHeader
        filter={filter}
        onBack={isChild ? handleBack : null}
        // onApply={isChild ? handleApply : null}
      />
      <View style={styles.contentContainer}>
        <RangeSlider
          style={styles.slider}
          min={min}
          max={max}
          low={lowValue}
          high={highValue}
          step={step}
          floatingLabel
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          onValueChanged={handleChangeValue}
        />
        <View style={styles.valuesContainer}>
          <Text style={[styles.textLabel, styles.textLeftValue]}>
            {min}
          </Text>
          {Array.from(Array(max - min - 1).keys()).map((item) => (
            <Text key={item} style={[styles.textLabel, styles.textCenterValue]}>
              {item + 2}
            </Text>
          ))}
          <Text style={[styles.textLabel, styles.textRightValue]}>
            {max}
          </Text>
        </View>
        <View style={styles.selectedValueContainer}>
          <Text style={styles.textLabel}>Selected grade:</Text>
          <Text style={styles.textSelectedValue}>
            {lowValue === highValue ? lowValue : `${lowValue} - ${highValue}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FilterChangeSlider;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    width: Styles.windowWidth,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
  },
  thumbContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: colors.primary,
  },
  railContainer: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  railUnselectedContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  railSelectedContainer: {
    backgroundColor: colors.primary,
  },
  stepContainer: {
    flex: 1,
    height: 6,
    borderRightWidth: 1,
    borderRightColor: Colors.white,
  },
  lastStepContainer: {
    borderRightColor: 'transparent',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 10,
  },
  textLabel: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
  },
  textCenterValue: {
    flex: 1,
    textAlign: 'center',
  },
  textLeftValue: {
    flex: 0.5,
  },
  textRightValue: {
    flex: 0.5,
    textAlign: 'right',
  },
  selectedValueContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  textSelectedGrade: {
    flex: 1,
  },
  textSelectedValue: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textAlign: 'center',
    color: colors.primaryText,
    marginLeft: 8,
  },
}));
