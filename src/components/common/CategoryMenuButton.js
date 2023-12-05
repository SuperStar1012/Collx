import React from 'react';
import {useSelector} from 'react-redux';

import {
  Button,
} from 'components';

import {
  Constants,
} from 'globals';

import {Colors, Fonts, createUseStyle} from 'theme';
import {wp} from 'utils';

const drawerIcon = require('assets/icons/line_three_horizontal.png');

const CategoryMenuButton = ({
  style,
  labelStyle,
  label,
  onPress,
}) => {
  const styles = useStyle();
  const appearanceMode = useSelector(state => state.user.appearanceMode);

  return (
    <Button
      style={[styles.container, style, appearanceMode === Constants.appearanceSettings.on ? styles.borderDark : styles.borderLight]}
      icon={drawerIcon}
      iconStyle={styles.iconDrawer}
      label={label}
      labelStyle={[styles.textCategory, labelStyle]}
      numberOfLines={1}
      scale={Button.scaleSize.Two}
      onPress={onPress}
    />
  );
};

export default CategoryMenuButton;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    height: 36,
    width: wp(22),
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
  },
  borderLight: {
    borderColor: Colors.softGray,
  },
  borderDark: {
    borderColor: Colors.moreGray,
  },
  textCategory: {
    flex: 1,
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 13,
    lineHeight: 18,
    color: colors.primaryText,
    marginLeft: 4,
  },
  iconDrawer: {
    tintColor: Colors.lightBlue,
    resizeMode: 'contain',
    width: 28,
    height: 28,
  },
}));
