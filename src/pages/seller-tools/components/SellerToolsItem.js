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

const SellerToolsItem = props => {
  const {style, icon, label, value, onPress} = props;

  const styles = useStyle();

  const renderValue = () => {
    if (!value) {
      return null;
    }

    return <Text style={[styles.textLabel, styles.textValue]}>{value}</Text>;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <View style={styles.contentContainer}>
        {icon ? <Image style={styles.iconType} source={icon} /> : null}
        <Text style={styles.textLabel}>{label}</Text>
      </View>
      {renderValue()}
      <Image style={styles.iconChevronRight} source={chevronIcon} />
    </TouchableOpacity>
  );
};

SellerToolsItem.defaultProps = {
  onPress: () => {},
};

SellerToolsItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.number,
  onPress: PropTypes.func,
};

export default SellerToolsItem;

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
  iconType: {
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
  textValue: {
    color: colors.grayText,
    textTransform: 'capitalize',
  },
  iconChevronRight: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.grayText,
  },
}));
