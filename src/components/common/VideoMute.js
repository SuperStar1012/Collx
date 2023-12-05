import React from 'react';
import {StyleSheet} from 'react-native';

import {Button} from 'components';

import {Colors} from 'theme';

const speakIcon = require('assets/icons/speaker_wave_fill.png');
const speakMuteIcon = require('assets/icons/speaker_slash_fill.png');

const VideoMute = ({
  style,
  isMuted,
  onPress
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Button
      style={[styles.muteButton, style]}
      scale={Button.scaleSize.Two}
      iconStyle={styles.iconSpeaker}
      icon={isMuted ? speakMuteIcon : speakIcon}
      onPress={handlePress}
    />
  );
};

VideoMute.defaultProps = {};

VideoMute.propTypes = {};

export default VideoMute;

const styles = StyleSheet.create({
  muteButton: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.blackAlpha4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpeaker: {
    width: '90%',
    height: '90%',
    tintColor: Colors.white,
  },
});
