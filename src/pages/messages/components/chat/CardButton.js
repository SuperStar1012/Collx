import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {Colors, createUseStyle} from 'theme';

const cardIcon = require('assets/icons/square_stack.png');

const CardButton = ({
  onPress,
  chatTheme,
}) => {
  const styles = useStyle();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handlePress}>
      <Image style={[styles.iconCard, {tintColor: chatTheme.primary}]} source={cardIcon} />
    </TouchableOpacity>
  );
};

CardButton.defaultProps = {
  onPress: () => {},
};

CardButton.propTypes = {
  onPress: PropTypes.func,
};

export default CardButton;

const useStyle = createUseStyle(() => ({
  container: {},
  iconCard: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    // tintColor: Colors.gray,
  },
}));
