import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

import Button from './Button';

import {Styles} from 'globals';
import {Colors} from 'theme';

const closeIcon = require('assets/icons/close_circle_fill.png');

const ImageZoomView = props => {
  const {isVisible, images, initialIndex, onClose} = props;

  let source = [];
  images.map(image => {
    if (typeof images[0] === 'number') {
      source.push({url: '', props: {source: image}});
    } else {
      source.push({url: image});
    }
  });

  return (
    <Modal
      style={styles.container}
      animationType="fade"
      visible={isVisible}
      transparent={true}>
      <ImageViewer
        enableSwipeDown
        imageUrls={source}
        index={initialIndex}
        saveToLocalByLongPress={false}
        onSwipeDown={() => onClose()}
        // renderIndicator={() => null}
      />
      <Button
        style={[styles.closeButton, {top: Styles.screenSafeTopHeight}]}
        icon={closeIcon}
        iconStyle={styles.iconClose}
        onPress={() => onClose()}
      />
    </Modal>
  );
};

ImageZoomView.defaultProps = {
  isVisible: false,
  images: [],
  initialIndex: 0,
  onClose: () => {},
};

ImageZoomView.propTypes = {
  isVisible: PropTypes.bool,
  images: PropTypes.array,
  initialIndex: PropTypes.number,
  onClose: PropTypes.func,
};

export default ImageZoomView;

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    marginTop: 16,
    right: 16,
  },
  iconClose: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    tintColor: Colors.lightGray,
  },
});
