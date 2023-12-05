import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
} from 'components';

import {createUseStyle, Fonts} from 'theme';

const UniversalSectionHeader = ({
  style,
  title,
  onViewAll,
}) => {
  const styles = useStyle();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textSectionTitle}>
        {title}
      </Text>
      <Button
        style={styles.viewAllButton}
        label="View All"
        labelStyle={styles.textViewAll}
        scale={Button.scaleSize.Two}
        onPress={handleViewAll}
      />
    </View>
  );
};

UniversalSectionHeader.defaultProps = {
  onPress: () => {},
};

UniversalSectionHeader.propTypes = {
  onPress: PropTypes.func,
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.primaryBackground,
  },
  textSectionTitle: {
    flex: 1,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.004,
    color: colors.primaryText,
    textTransform: 'capitalize',
    marginHorizontal: 16,
  },
  viewAllButton: {
    paddingHorizontal: 16,
  },
  textViewAll: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
}));

export default UniversalSectionHeader;
