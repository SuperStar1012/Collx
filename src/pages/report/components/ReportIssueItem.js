import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {createUseStyle} from 'theme';

const chevronIcon = require('assets/icons/chevron_forward.png');

const ReportIssueItem = props => {
  const {style, icon, label, onPress} = props;

  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <View style={styles.contentContainer}>
        {icon ? <Image style={styles.icon} source={icon} /> : null}
        <Text style={styles.textLabel}>{label}</Text>
      </View>
      <Image style={styles.iconChevronRight} source={chevronIcon} />
    </TouchableOpacity>
  );
};

ReportIssueItem.defaultProps = {
  onPress: () => {},
};

ReportIssueItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.number,
  onPress: PropTypes.func,
};

export default ReportIssueItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
    marginRight: 12,
  },
  textLabel: {
    fontSize: 17,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  iconChevronRight: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
}));
