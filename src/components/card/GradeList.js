import React from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Fonts, createUseStyle} from 'theme';

const GradeList = ({
  style,
  grades,
  currentGrade,
  onSelect,
}) => {
  const styles = useStyle();

  const handleSelectItem = item => {
    if (onSelect) {
      onSelect(item);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        item === currentGrade && styles.itemSelectContainer,
      ]}
      activeOpacity={0.8}
      onPress={() => handleSelectItem(item)}>
      <Text
        style={[
          styles.textGrade,
          item === currentGrade && styles.textSelectGrade,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (!grades?.length) {
    return null;
  }

  return (
    <FlatList
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={grades}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

GradeList.defaultProps = {
  onSelect: () => {},
};

GradeList.propTypes = {
  currentGrade: PropTypes.string,
  grades: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

export default GradeList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginBottom: 20,
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondaryCardBackground,
    backgroundColor: colors.secondaryCardBackground,
    marginHorizontal: 4,
  },
  itemSelectContainer: {
    borderColor: colors.primary,
  },
  textGrade: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textSelectGrade: {
    color: colors.primary,
  },
}));
