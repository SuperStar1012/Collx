import React from 'react';
import {
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import Button from '../common/Button';

import {Constants} from 'globals';
import {Colors, createUseStyle, useTheme} from 'theme';

const trendingUpIcon = require('assets/icons/up_arrow.png');
const trendingDownIcon = require('assets/icons/down_arrow.png');

const TrendingSwitch = props => {
  const {style, orderMode, onPress} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  let leftBackgroundColor = '';
  let leftTintColor = '';
  let rightBackgroundColor = '';
  let rightTintColor = '';

  if (orderMode === Constants.orderByMode.ascending) {
    leftBackgroundColor = colors.primary;
    leftTintColor = Colors.white;
    rightBackgroundColor = colors.secondaryCardBackground;
    rightTintColor = colors.primaryText;
  } else if (orderMode === Constants.orderByMode.descending) {
    leftBackgroundColor = colors.secondaryCardBackground;
    leftTintColor = colors.primaryText;
    rightBackgroundColor = colors.primary;
    rightTintColor = Colors.white;
  }

  return (
    <View style={[styles.container, style]}>
      <Button
        style={[
          styles.trendingUpButton,
          {backgroundColor: leftBackgroundColor},
        ]}
        icon={trendingUpIcon}
        iconStyle={[styles.iconTrending, {tintColor: leftTintColor}]}
        scaleDisabled={true}
        onPress={() => onPress(Constants.orderByMode.ascending)}
      />
      <Button
        style={[
          styles.trendingDownButton,
          {backgroundColor: rightBackgroundColor},
        ]}
        icon={trendingDownIcon}
        iconStyle={[styles.iconTrending, {tintColor: rightTintColor}]}
        scaleDisabled={true}
        onPress={() => onPress(Constants.orderByMode.descending)}
      />
      <View style={styles.comingSoonContainer} />
    </View>
  );
};

TrendingSwitch.defaultProps = {
  orderMode: Constants.orderByMode.ascending,
  onPress: () => {},
};

TrendingSwitch.propTypes = {
  orderMode: PropTypes.string,
  onPress: PropTypes.func,
};

export default TrendingSwitch;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: 52,
    height: 25,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingUpButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderTopLeftRadius: 12.5,
    borderBottomLeftRadius: 12.5,
  },
  trendingDownButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderTopRightRadius: 12.5,
    borderBottomRightRadius: 12.5,
  },
  iconTrending: {
    width: 28,
    height: 28,
  },
  comingSoonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.comingBackground,
  },
}));
