import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button, SearchBar} from 'components';

import {createUseStyle} from 'theme';

const filterIcon = require('assets/icons/horizontal_decrease_circle.png');

const SearchSortFilter = props => {
  const {
    style,
    editable,
    defaultValue,
    onChangeSearch,
    onChangeSearchInMode,
    onOpenSortAndFilter,
  } = props;

  const styles = useStyle();

  const handleSortFilter = () => {
    onOpenSortAndFilter();
  };

  const handleChangeSearch = value => {
    onChangeSearch(value);
  };

  const handleDelete = () => {
    onChangeSearch('');
  };

  const handleCancel = () => {
    onChangeSearch('');
    onChangeSearchInMode(false);
  };

  const handleFocus = () => {
    onChangeSearchInMode(true);
  };

  const handleBlur = () => {
    onChangeSearchInMode(false);
  };

  return (
    <View style={[styles.container, style]}>
      <SearchBar
        style={styles.searchBar}
        placeholder="Search Items"
        defaultValue={defaultValue}
        editable={editable}
        onChangeText={handleChangeSearch}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Button
        style={styles.filterButton}
        icon={filterIcon}
        iconStyle={styles.iconFilter}
        scale={Button.scaleSize.Zero}
        onPress={handleSortFilter}
      />
    </View>
  );
};

SearchSortFilter.defaultProps = {
  onChangeSearch: () => {},
  onChangeSearchInMode: () => {},
  onOpenSortAndFilter: () => {},
};

SearchSortFilter.propTypes = {
  editable: PropTypes.bool,
  onChangeSearch: PropTypes.func,
  onChangeSearchInMode: PropTypes.func,
  onOpenSortAndFilter: PropTypes.func,
};

export default SearchSortFilter;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 9,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryCardBackground,
    marginRight: 10,
  },
  iconFilter: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
}));
