import React from 'react';

import {
  Button,
  BottomModalHeader,
} from 'components';

import {createUseStyle, Fonts} from 'theme';

const chevronLeftIcon = require('assets/icons/chevron_backward.png');

const FilterChangeHeader = ({
  filter,
  onClear,
  onApply,
  onBack,
}) => {
  const {name} = filter || {};

  const styles = useStyle();

  const renderClear = () => (
    <Button
      style={styles.button}
      label="Clear"
      labelStyle={styles.textButton}
      scale={Button.scaleSize.Four}
      onPress={onClear}
    />
  );

  const renderApply = () => (
    <Button
      style={styles.button}
      label="Apply"
      labelStyle={[styles.textButton, styles.textApply]}
      scale={Button.scaleSize.Four}
      onPress={onApply}
    />
  );

  const renderBack = () => (
    <Button
      style={styles.button}
      icon={chevronLeftIcon}
      iconStyle={styles.iconChevronLeft}
      scale={Button.scaleSize.Four}
      onPress={onBack}
    />
  );

  return (
    <BottomModalHeader
      title={name}
      titleNumberOfLines={1}
      isHideClose
      headerLeft={onClear ? renderClear : renderBack ? renderBack : null}
      headerRight={onApply ? renderApply : null}
    />
  );
};

export default FilterChangeHeader;

const useStyle = createUseStyle(({colors}) => ({
  button: {},
  textButton: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  textApply: {
    fontWeight: Fonts.semiBold,
  },
  iconChevronLeft: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
}));
