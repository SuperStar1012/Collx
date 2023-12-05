import React from 'react';

import {Button} from 'components';

import {Colors, createUseStyle} from 'theme';

const messageIcon = require('assets/icons/message.png');

const ConversationButton = React.memo((props) => {
  const {style, on, onPress} = props;

  const styles = useStyle();

  let buttonStyle = styles.buttonIsOff;
  let iconStyle = styles.iconIsOff;
  if (on) {
    buttonStyle = styles.buttonIsOn;
    iconStyle = styles.iconIsOn;
  }

  return (
    <Button
      style={[styles.button, buttonStyle, style]}
      icon={messageIcon}
      iconStyle={[styles.icon, iconStyle]}
      scale={Button.scaleSize.Two}
      onPress={onPress}
    />
  );
});

ConversationButton.displayName = 'ConversationButton';

export default ConversationButton;

const useStyle = createUseStyle(({colors}) => ({
  button: {
    width: 45,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.secondaryCardBackground, // primary,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIsOn: {
    backgroundColor: colors.primary
  },
  buttonIsOff: {
    backgroundColor: colors.secondaryCardBackground
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  iconIsOn: {
    tintColor: Colors.white
  },
  iconIsOff: {
    tintColor: colors.primary
  }
}));
