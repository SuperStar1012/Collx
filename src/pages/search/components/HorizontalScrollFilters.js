import React, {useMemo, useState, useRef} from 'react';
import {View, ScrollView} from 'react-native';

import {
  Button,
} from 'components';
import HorizontalScrollFilterItem from './HorizontalScrollFilterItem';
import FilterChangeSheet from './FilterChangeSheet';

import {withSearch} from 'store/containers';
import {createUseStyle} from 'theme';
import {useActions} from 'actions';
import {SearchFilterOptions} from 'globals';
import {getFilterOptions} from 'utils';

const horizontalDecreaseIcon = require('assets/icons/horizontal_decrease_circle.png');

const HorizontalScrollFilters = ({
  selectedCategory,
  mainFilterOptions,
  setSearchCategory,
  setMainFilterOptions,
}) => {
  const styles = useStyle();
  const actions = useActions();

  const [isVisibleChangeSheet, setIsVisibleChangeSheet] = useState(false);
  const currentFilter = useRef(null);

  const filterOptions = mainFilterOptions;

  const filterData = useMemo(() => {
    if (!filterOptions) {
      return [];
    }

    if (selectedCategory) {
      const mixValues = getFilterOptions(filterOptions, [{
        name: SearchFilterOptions.filterNames.category,
        value: selectedCategory.value}],
      );
      return mixValues.filterOptions;
    }

    return filterOptions;
  }, [filterOptions, selectedCategory]);

  const handleSelect = item => {
    currentFilter.current = item;
    setIsVisibleChangeSheet(true);
  };

  const handleCloseSheet = () => {
    currentFilter.current = null;
    setIsVisibleChangeSheet(false);
  };

  const handleApplyFilters = (selectedOption) => {
    const mixValues = getFilterOptions(filterOptions, selectedOption, selectedCategory?.value);

    if (mixValues.categoryOption) {
      setSearchCategory(mixValues.categoryOption);
    }

    setMainFilterOptions(mixValues.filterOptions);
  };

  const handleClearFilters = (selectedOption) => {
    const mixValues = getFilterOptions(filterOptions, selectedOption, selectedCategory?.value);

    if (mixValues.categoryOption) {
      setSearchCategory(mixValues.categoryOption);
    }

    setMainFilterOptions(mixValues.filterOptions);
  };

  const handleOpenFilters = () => {
    actions.navigateSearchFilters();
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterButtonContainer}>
        <Button
          style={styles.filterButton}
          icon={horizontalDecreaseIcon}
          iconStyle={styles.iconHorizontalDecrease}
          label="Filters"
          labelStyle={styles.textFilters}
          scale={Button.scaleSize.Two}
          onPress={handleOpenFilters}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {filterData.map((item, index) => (
          <HorizontalScrollFilterItem
            key={index}
            filter={item}
            onPress={handleSelect}
          />
        ))}
      </ScrollView>
      <FilterChangeSheet
        isVisible={isVisibleChangeSheet}
        filter={currentFilter.current}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={handleCloseSheet}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: colors.primaryBorder,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryBorder,
  },
  contentContainer: {
    paddingRight: 16,
  },
  filterButtonContainer: {
    paddingLeft: 16,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.primaryBorder,
  },
  filterButton: {
    paddingVertical: 6,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: colors.secondaryCardBackground,
    marginVertical: 5,
  },
  textFilters: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.primaryText,
    letterSpacing: -0.08,
  },
  iconHorizontalDecrease: {
    tintColor: colors.primary,
    resizeMode: 'contain',
    width: 28,
    height: 28,
  },
}));

export default withSearch(HorizontalScrollFilters);
