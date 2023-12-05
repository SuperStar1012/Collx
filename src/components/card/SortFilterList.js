import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {Button, Chip} from 'components';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const SortFilterList = props => {
  const {style, sort, filter, onClear} = props;

  const styles = useStyle();

  if (!sort && !filter) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.chipsContainer}>
        {sort ? (
          <Chip
            label={`${
              Constants.cardSortFilterCategory.sort
            } by ${sort?.toLowerCase()}`}
            onDelete={() =>
              onClear({
                category: Constants.cardSortFilterCategory.sort,
                value: sort,
              })
            }
          />
        ) : null}
        {filter ? (
          <Chip
            label={`${Constants.cardSortFilterCategory.filter} by ${filter}`}
            onDelete={() =>
              onClear({
                category: Constants.cardSortFilterCategory.filter,
                value: filter,
              })
            }
          />
        ) : null}
      </View>
      <Button
        label="Clear all"
        labelStyle={styles.textClearAll}
        onPress={() => onClear(null)}
      />
    </View>
  );
};

SortFilterList.defaultProps = {
  sort: null,
  filter: null,
  onClear: () => {},
};

SortFilterList.propTypes = {
  sort: PropTypes.string,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClear: PropTypes.func,
};

export default SortFilterList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
  },
  chipsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textClearAll: {
    fontWeight: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.primary,
  },
}));
