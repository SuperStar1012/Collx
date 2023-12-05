import React from 'react';
import {
  View,
} from 'react-native';

import {
  Button,
  CategoryMenuButton,
} from 'components';

import {createUseStyle} from 'theme';
import {wp} from 'utils';
import {Constants} from 'globals';

const UniversalSearchHeader = ({
  categoryLabel,
  searchedCategories,
  onPressCategory,
  onPressSearch,
}) => {
  const styles = useStyle();

  const handleCategory = () => {
    if (onPressCategory) {
      onPressCategory();
    }
  };

  const handleFilter = filterItem => {
    if (onPressSearch) {
      onPressSearch(filterItem);
    }
  };

  return (
    <View style={styles.container}>
      <CategoryMenuButton
        style={styles.categoryButton}
        label={categoryLabel}
        onPress={handleCategory}
      />
      <View style={styles.filterContainer}>
        {searchedCategories.map((item, index) => (
          <Button
            key={index}
            style={styles.filterButton}
            label={Constants.searchCategories[item]}
            labelStyle={styles.textFilter}
            scale={Button.scaleSize.Two}
            onPress={() => handleFilter(item)}
          />
        ))}
      </View>
    </View>
  );
};

export default UniversalSearchHeader;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  categoryButton: {
    height: 32,
    width: wp(28),
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: colors.secondaryCardBackground,
    marginLeft: 8,
    borderRadius: 40,
  },
  textFilter: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary,
  },
}));
