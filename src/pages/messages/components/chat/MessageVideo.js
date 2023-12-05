import React, {useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';

import {Button} from 'components';

import {Colors} from 'theme';

const playIcon = require('assets/icons/more/play.png');

const MessageVideo = ({currentMessage}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef(null);

  const handlePlay = () => {
    if (!videoRef) {
      return;
    }

    videoRef.current.presentFullscreenPlayer();
  };

  const handleFullscreenPlayerWillPresent = () => {
    setIsPaused(false);
  };

  const handleFullscreenPlayerWillDismiss = () => {
    setIsPaused(true);
  };

  const renderPlay = () => {
    if (!isVideoLoaded) {
      return null;
    }

    return (
      <Button
        style={styles.playButton}
        scale={Button.scaleSize.Two}
        iconStyle={styles.iconPlay}
        icon={playIcon}
        onPress={() => handlePlay()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{uri: currentMessage.video}}
        paused={isPaused}
        onLoad={() => setIsVideoLoaded(true)}
        onFullscreenPlayerWillPresent={handleFullscreenPlayerWillPresent}
        onFullscreenPlayerWillDismiss={handleFullscreenPlayerWillDismiss}
      />
      {renderPlay()}
    </View>
  );
};

MessageVideo.defaultProps = {};

MessageVideo.propTypes = {};

export default MessageVideo;

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: Colors.black,
  },
  playButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.darkGrayAlpha7,
  },
  iconPlay: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});
