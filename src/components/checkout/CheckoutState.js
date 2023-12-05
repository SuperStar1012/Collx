import React, {useMemo} from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {Orders} from 'globals';
import {Fonts} from 'theme';

const CheckoutState = ({
  style,
  iconStyle,
  textStyle,
  state,
  isGroup,
}) => {
  const styles = useStyle();

  const currentState = useMemo(() => Orders.orderStates()[state], [state]);

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
        {isGroup ? currentState.groupLabel : currentState.shortLabel}
      </Text>
    </View>
  );
};

CheckoutState.displayName = 'CheckoutState';

export default CheckoutState;

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
