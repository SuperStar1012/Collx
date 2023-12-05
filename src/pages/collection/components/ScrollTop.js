import React from 'react';

import {
  Button,
} from 'components';

import {Fonts, createUseStyle} from 'theme';

const arrowUpIcon = require('assets/icons/arrow_up.png');

const ScrollTop = ({
  offset,
  height,
  subTitleHeight,
  marginBottom,
  onPress,
}) => {
  const styles = useStyle();

  if (offset === 0 || height === 0 || offset <= height) {
    return null;
  }

  const handleScrollToTop = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Button
      style={[styles.button, {top: height - marginBottom - subTitleHeight}]}
      icon={arrowUpIcon}
      iconStyle={styles.iconArrowUp}
      label="TOP"
      labelStyle={styles.textTop}
      scale={Button.scaleSize.Two}
      onPress={handleScrollToTop}
    />
  );
};

ScrollTop.defaultProps = {};

ScrollTop.propTypes = {};

export default ScrollTop;

const useStyle = createUseStyle(({colors}) => ({
  button: {
    position: 'absolute',
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    flexDirection: 'column',
    backgroundColor: colors.scrollTopBackground,
  },
  iconArrowUp: {
    width: 24,
    height: 24,
    tintColor: colors.scrollTopText,
  },
  textTop: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    letterSpacing: -0.38,
    color: colors.scrollTopText,
  }
}));
