import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import SearchBar from './SearchBar';

const SearchBarButton = props => {
  const {onPress, ...otherProps} = props;

  return (
    <View style={styles.container}>
      <SearchBar {...otherProps} />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    ...StyleSheet.absoluteFillObject,
  },
});

SearchBarButton.defaultProps = {
  onPress: () => {},
};

SearchBarButton.propTypes = {
  onPress: PropTypes.func,
};

export default SearchBarButton;
