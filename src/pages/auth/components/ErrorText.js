import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {Colors} from 'theme';

const ErrorText = props => {
  const {style, visible, errorMessage} = props;

  const styles = useStyle();

  if (!visible) {
    return null;
  }

  return <Text style={[styles.textError, style]}>{errorMessage}</Text>;
};

ErrorText.defaultProps = {
  visible: false,
};

ErrorText.propTypes = {
  visible: PropTypes.bool,
};

export default ErrorText;

const useStyle = () =>
  StyleSheet.create({
    textError: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.08,
      color: Colors.red,
    },
  });
