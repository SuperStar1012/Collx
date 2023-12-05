import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {WithdrawalStatusValues} from './States';
import {Fonts} from 'theme';

const HistoryState = ({style, iconStyle, textStyle, state}) => {
  const styles = useStyle();

  const currentState = WithdrawalStatusValues[state];

  if (!currentState) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        style={[styles.icon, iconStyle, {tintColor: currentState.color}]}
        source={currentState.icon}
      />
      <Text style={[styles.textLabel, textStyle, {color: currentState.color}]}>
        {currentState.label}
      </Text>
    </View>
  );
};

export default HistoryState;

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
