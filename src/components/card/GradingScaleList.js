import React from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, Fonts, createUseStyle} from 'theme';

const GradingScaleList = ({
  style,
  gradingScales,
  currentGradingScale,
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
        item === currentGradingScale && styles.itemSelectContainer,
      ]}
      activeOpacity={0.8}
      onPress={() => handleSelectItem(item)}>
      <Text
        style={[
          styles.textGrade,
          item === currentGradingScale && styles.textSelectGrade,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (!gradingScales?.length) {
    return null;
  }

  return (
    <FlatList
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={gradingScales}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

GradingScaleList.defaultProps = {
  onSelect: () => {},
};

GradingScaleList.propTypes = {
  currentGradingScale: PropTypes.string,
  gradingScales: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
};

export default GradingScaleList;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginBottom: 12,
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  itemContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 4,
  },
  itemSelectContainer: {
    backgroundColor: colors.primary,
  },
  textGrade: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  textSelectGrade: {
    color: Colors.white,
  },
}));
