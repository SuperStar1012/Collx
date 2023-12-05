import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import {Styles} from 'globals';
import {Colors} from 'theme';

const cameraIcon = require('assets/icons/camera_fill.png');
const size = Math.floor((Styles.windowWidth - 24) / 4);

const CameraItem = props => {
  const {style, onPress} = props;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={onPress}>
      <Image style={styles.iconCamera} source={cameraIcon} />
    </TouchableOpacity>
  );
};

CameraItem.defaultProps = {
  onPress: () => {},
};

CameraItem.propTypes = {
  onPress: PropTypes.func,
};

export default CameraItem;

const styles = StyleSheet.create({
  container: {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    overflow: 'hidden',
    backgroundColor: Colors.gray,
  },
  cameraPreview: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  iconCamera: {
    width: 28,
    height: 28,
    tintColor: Colors.white,
  },
});
