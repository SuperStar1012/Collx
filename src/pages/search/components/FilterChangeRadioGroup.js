import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  RadioGroup,
} from 'components';
import FilterChangeHeader from './FilterChangeHeader';

import {Styles} from 'globals';
import {createUseStyle} from 'theme';

const FilterChangeRadioGroup = ({
  filter,
  isChild,
  onApply,
  onClear,
  onChangeValue,
  onBack,
}) => {
  const {value, name, options} = filter;

  const insets = useSafeAreaInsets();
  const styles = useStyle();

  const [currentValue, setCurrentValue] = useState(value || options[0]?.value);

  useEffect(() => {
    setCurrentValue(value || options[0]?.value);
  }, [filter]);

  const handleChangeValue = newValue => {
    setCurrentValue(newValue);

    if (isChild && onChangeValue) {
      onChangeValue(name, newValue);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(name, currentValue);
    }
  };

  const handleClear = () => {
    setCurrentValue(options[0]?.value);

    if (onClear) {
      onClear(name);
    }
  };

  return (
    <View style={styles.container}>
      <FilterChangeHeader
        filter={filter}
        onApply={!isChild ? handleApply : null}
        onClear={!isChild ? handleClear : null}
        onBack={isChild ? onBack : null}
      />
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{paddingBottom: insets.bottom}}
      >
        <RadioGroup
          style={styles.radioContainer}
          buttonStyle={styles.radioButtonContainer}
          labelStyle={styles.labelRadio}
          value={currentValue}
          data={options}
          onChangeValue={handleChangeValue}
        />
      </ScrollView>
    </View>
  );
};

export default FilterChangeRadioGroup;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    width: Styles.windowWidth,
  },
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
  },
  radioContainer: {},
  radioButtonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
    marginBottom: 0,
  },
  labelRadio: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    paddingLeft: 0,
  },
}));
