import React from 'react';
import {TouchableOpacity, Image} from 'react-native';

import {Colors} from 'theme';

const cameraIcon = require('assets/icons/camera.png');

const TabBarCameraButton = props => {
  const handleOpenCamera = () => {
    const {navigation} = props;
    navigation.navigate('CameraStackModal');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => handleOpenCamera()}>
      <Image source={cameraIcon} style={styles.iconCamera} />
    </TouchableOpacity>
  );
};

export default TabBarCameraButton;

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCamera: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: Colors.lightGray,
  },
};
