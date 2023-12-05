import React from 'react';

import {
  Button,
} from 'components';

import {Colors, createUseStyle} from 'theme';

const aiBotAvatarIcon = require('assets/icons/more/ai_bot_avatar.png');

export const FloatingButtonSize = 56;

const AIFloatingButton = ({
  onPress,
}) => {
  const styles = useStyle();

  const handleOpenAIChat = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Button
      style={styles.button}
      icon={aiBotAvatarIcon}
      iconStyle={styles.iconArrowUp}
      scale={Button.scaleSize.Two}
      onPress={handleOpenAIChat}
    />
  );
};

AIFloatingButton.defaultProps = {};

AIFloatingButton.propTypes = {};

export default AIFloatingButton;

const useStyle = createUseStyle(({colors}) => ({
  button: {
    overflow: 'visible',
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: FloatingButtonSize,
    height: FloatingButtonSize,
    borderRadius: FloatingButtonSize / 2,
    backgroundColor: colors.primary,
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
  },
  iconArrowUp: {
    width: 43,
    height: 43,
  },
}));
