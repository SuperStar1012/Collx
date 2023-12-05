import React, {useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {createUseStyle} from 'theme';
import {SearchFilterOptions} from 'globals';

const chevronIcon = require('assets/icons/chevron_down.png');

const SearchFilterItem = ({
  style,
  filter,
  onPress,
}) => {
  const styles = useStyle();

  const {name, value, options} = filter;

  const currentLabel = useMemo(() => {
    if (name === SearchFilterOptions.filterNames.grade) {
      // Grade
      const gradeOption = SearchFilterOptions.filterOptions.find(item => item.value === value);
      return gradeOption?.label || SearchFilterOptions.filterOptions[0].label;
    }

    // Others
    const option = options.find(item => item.value === value);
    return option?.label || options[0].label;
  }, [name, value, options]);

  const handlePress = () => {
    if (onPress) {
      onPress(filter);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handlePress}>
      <View style={styles.contentContainer}>
        <Text
          style={[styles.textNormal, styles.textLabel]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Image style={styles.iconChevron} source={chevronIcon} />
      </View>
      <Text
        style={[styles.textNormal, styles.textValue]}
        numberOfLines={1}
      >
        {currentLabel}
      </Text>
    </TouchableOpacity>
  );
};

SearchFilterItem.defaultProps = {
  onPress: () => {},
};

SearchFilterItem.propTypes = {
  onPress: PropTypes.func,
};

export default SearchFilterItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: colors.primaryBorder,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textNormal: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  textLabel: {
    color: colors.primaryText,
  },
  textValue: {
    color: colors.darkGrayText,
    marginTop: 2,
  },
  iconChevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.primary,
    marginLeft: 4,
  },
}));
