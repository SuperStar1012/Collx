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

const chevronIcon = require('assets/icons/chevron_forward.png');

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
        <Text
          style={[styles.textNormal, styles.textValue]}
          numberOfLines={1}
        >
          {currentLabel}
        </Text>
      </View>
      <Image style={styles.iconChevron} source={chevronIcon} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  contentContainer: {
    flex: 1,
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
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.lightGrayText,
  },
}));
