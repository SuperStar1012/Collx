import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {Fonts} from 'theme';

const ExportStatus = ({
  style,
  iconStyle,
  textStyle,
  status,
}) => {
  const styles = useStyle();

  if (!status) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        style={[styles.icon, iconStyle, {tintColor: status.color}]}
        source={status.icon}
      />
      <Text style={[styles.textLabel, textStyle, {color: status.color}]}>
        {status.label}
      </Text>
    </View>
  );
};

export default ExportStatus;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    },
    textLabel: {
      fontWeight: Fonts.bold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: -0.08,
      marginLeft: 4,
    },
  });
