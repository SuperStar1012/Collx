import React from 'react';

import {Button} from 'components';

import {Colors, createUseStyle} from 'theme';
import {wp} from 'utils';

const playIcon = require('assets/icons/more/play.png');

const VideoPlay = ({
  style,
  isVisiblePlay,
  onPlay,
}) => {
  const styles = useStyle();

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    }
  };

  if (!isVisiblePlay) {
    return null;
  }

  return (
    <Button
      style={[styles.playButton, style]}
      scale={Button.scaleSize.Two}
      iconStyle={styles.iconPlay}
      icon={playIcon}
      onPress={handlePlay}
    />
  );
};

VideoPlay.defaultProps = {};

VideoPlay.propTypes = {};

export default VideoPlay;

const useStyle = createUseStyle(() => ({
  playButton: {
    position: 'absolute',
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: Colors.blackAlpha6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlay: {
    width: wp(7),
    height: wp(7),
    resizeMode: 'contain',
  },
}));
