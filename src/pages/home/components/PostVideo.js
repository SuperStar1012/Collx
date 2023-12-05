import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import Config from 'react-native-config';
import {useIsFocused} from '@react-navigation/native';

import {LoadingIndicator, VideoPlay, VideoMute} from 'components';

import {Colors} from 'theme';
import {
  useIsForeground,
} from 'hooks';

const PostVideo = ({
  style,
  mediaWidth,
  videoUrl,
  isAutoPlay = false,
  isActivePost,
}) => {
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActiveVideo = isFocussed && isForeground;

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoSize, setVideoSize] = useState({
    width: mediaWidth,
    height: mediaWidth / 2,
  });
  const [isPaused, setIsPaused] = useState(!isAutoPlay);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef(null);

  const isPrevActiveVideo = useRef(isActiveVideo);
  const isPrevPaused = useRef(isPaused);

  useEffect(() => {
    if (isActivePost) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }, [isActivePost]);

  useEffect(() => {
    if (isActivePost) {
      if (!isPrevActiveVideo.current && isActiveVideo) {
        setIsPaused(isPrevActiveVideo.current);
      } else if (isPrevActiveVideo.current && !isActiveVideo) {
        setIsPaused(true);
      }
    }

    isPrevActiveVideo.current = isActiveVideo;
  }, [isActiveVideo]);

  useEffect(() => {
    if (isActiveVideo && isPaused !== isPrevPaused.current) {
      isPrevPaused.current = isPaused;
    }
  }, [isActiveVideo, isPaused]);

  const handlePlay = () => {
    if (!videoRef || isAutoPlay) {
      return;
    }

    setIsPaused(!isPaused);
    setIsMuted(false);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLoad = ({naturalSize}) => {
    setVideoSize(naturalSize);
    setIsVideoLoaded(true);
  };

  const handleEnd = () => {
    if (!videoRef) {
      return;
    }

    // replay
    videoRef.current.seek(0);
  };

  const handleError = () => {};

  const videoHeight = Math.round(mediaWidth / videoSize.width * videoSize.height);

  return (
    <View style={[styles.container, style, {width: mediaWidth, height: videoHeight}]}>
      <LoadingIndicator lottieStyle={styles.iconLoading} isLoading={!isVideoLoaded} />
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={0.9}
        disabled={isAutoPlay}
        onPress={handlePlay}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{uri: `${Config.STRAPI_BASE_URL}${videoUrl}`}}
          paused={isPaused}
          muted={isMuted}
          onLoad={handleLoad}
          onError={handleError}
          onEnd={handleEnd}
        />
      </TouchableOpacity>
      <VideoPlay
        isVisiblePlay={isVideoLoaded && !isAutoPlay && isPaused}
        onPlay={handlePlay}
      />
      <VideoMute
        style={styles.muteButton}
        isMuted={isMuted}
        onPress={handleMute}
      />
    </View>
  );
};

PostVideo.defaultProps = {};

PostVideo.propTypes = {};

export default PostVideo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black,
  },
  iconLoading: {
    width: 50,
    height: 50,
  },
  muteButton: {
    right: 10,
    bottom: 10,
  },
});
