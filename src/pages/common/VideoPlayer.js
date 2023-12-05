import React, {useRef} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import Video from 'react-native-video';

import {Button} from 'components';

import {Colors} from 'theme';

const closeIcon = require('assets/icons/close.png');

const VideoPlayer = ({
  navigation,
  route
}) => {
  const {uri} = route.params || {};

  const videoRef = useRef(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLoad = () => {
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer();
    }
  };

  const handleError = (error) => {
    console.log(error);
  };

  const handleFullscreenPlayerWillDismiss	 = () => {
    handleGoBack();
  };

  const renderClose = () => {
    if (Platform.OS !== 'android') {
      return null;
    }

    return (
      <Button
        style={styles.closeButton}
        scale={Button.scaleSize.Two}
        iconStyle={styles.iconClose}
        icon={closeIcon}
        onPress={handleGoBack}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderClose()}
      <Video
        ref={videoRef}
        style={styles.video}
        source={{uri}}
        controls={Platform.OS === 'android'}
        onLoad={handleLoad}
        onError={handleError}
        onEnd={handleGoBack}
        onFullscreenPlayerWillDismiss={handleFullscreenPlayerWillDismiss}
      />
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      android: Colors.black,
    }),
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: Platform.select({
      ios: 0,
      android: '100%',
    }),
    height: Platform.select({
      ios: 0,
      android: '100%',
    }),
  },
  closeButton: {
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: Colors.darkGrayAlpha7,
    position: 'absolute',
    left: 15,
    top: 15,
  },
  iconClose: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});
