import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import FilterChangeHeader from './FilterChangeHeader';

import {Styles, SearchFilterOptions} from 'globals';
import {createUseStyle} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const FilterChangeList = ({
  filter,
  onSelect,
  onApply,
  onClear,
  onBack,
}) => {
  const {name, options} = filter;

  const insets = useSafeAreaInsets();
  const styles = useStyle();

  const getValue = (item) => {
    const {value, lowValue, highValue, label} = item;
    if (name === SearchFilterOptions.filterNames.grade) {
      // Grade
      if (label === SearchFilterOptions.filterNames.grades && lowValue && highValue) {
        let value = null;
        if (lowValue === highValue) {
          value = lowValue;
        } else if (lowValue > 0 || highValue < 10) {
          value = `${lowValue} - ${highValue}`;
        }
        return value;
      }

      const gradeOption = SearchFilterOptions.filterOptions.find(item => item.value === value);

      return gradeOption?.label || SearchFilterOptions.filterOptions[0].label;
    }

    // Others
    const option = SearchFilterOptions.filterOptions.find(item => item.value === value);
    return option?.label || SearchFilterOptions.filterOptions[0].label;
  };

  const handleSelectItem = (item) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.8}
      onPress={() => handleSelectItem(item)}>
      <Text style={styles.textLabel} numberOfLines={1}>
        {item.label}
      </Text>
      <Text style={styles.textValue} numberOfLines={1}>
        {getValue(item)}
      </Text>
      <Image style={styles.iconChevronRight} source={chevronIcon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FilterChangeHeader
        filter={filter}
        onApply={onApply}
        onClear={onClear}
        onBack={onBack}
      />
      <FlatList
        style={styles.contentContainer}
        contentContainerStyle={{paddingBottom: insets.bottom}}
        data={options}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default FilterChangeList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    width: Styles.windowWidth,
  },
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  textLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
  },
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  iconChevronRight: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: colors.lightGrayText,
  },
}));
