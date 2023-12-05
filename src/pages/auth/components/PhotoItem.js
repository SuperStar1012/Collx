import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {Styles} from 'globals';
import {createUseStyle} from 'theme';

const size = Math.floor((Styles.windowWidth - 24) / 4);

const PhotoItem = props => {
  const {style, photo, isSelected, onPress} = props;

  const styles = useStyle();

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={() => onPress()}>
      <Image style={styles.imagePhoto} source={photo} />
      {isSelected && <View style={styles.borderContainer} />}
    </TouchableOpacity>
  );
};

PhotoItem.defaultProps = {
  isSelected: false,
  onPress: () => {},
};

PhotoItem.propTypes = {
  photo: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func,
};

export default PhotoItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    overflow: 'hidden',
  },
  borderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  imagePhoto: {
    width: '100%',
    height: '100%',
  },
}));
