import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {Colors, Fonts} from 'theme';

const ExportStatusBar = ({
  style,
  status,
}) => {
  const styles = useStyle();

  if (!status) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: status.color},
        style,
      ]}
    >
      <Text style={styles.textStatus}>{status.description}</Text>
    </View>
  );
};

export default ExportStatusBar;

const useStyle = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: 44,
      justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: Colors.yellow
    },
    textStatus: {
      fontWeight: Fonts.semiBold,
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: -0.24,
      color: Colors.white,
    },
  });
