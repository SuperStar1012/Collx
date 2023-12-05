import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {SchemaTypes} from 'globals';
import {Colors, Fonts} from 'theme';

const dealStates = {
  [SchemaTypes.dealState.ACCEPTED]: {
    color: Colors.green,
    label: 'Accepted',
    icon: require('assets/icons/checkmark_circle_outline.png'),
  },
  [SchemaTypes.dealState.CANCELLED]: {
    color: Colors.darkGray,
    label: 'Cancelled',
    icon: require('assets/icons/close_circle_outline.png'),
  },
  [SchemaTypes.dealState.COMPLETED]: {
    color: Colors.green,
    label: 'Completed',
    icon: require('assets/icons/checkmark_circle_outline.png'),
  },
  [SchemaTypes.dealState.EXPIRED]: {
    color: Colors.darkGray,
    label: 'Expired',
    icon: require('assets/icons/close_circle_outline.png'),
  },
  [SchemaTypes.dealState.OFFER_SENT]: {
    color: Colors.yellow,
    label: 'Offer Sent',
    icon: require('assets/icons/clock_arrow_two_circle.png'),
  },
  [SchemaTypes.dealState.PENDING]: {
    color: Colors.darkGray,
    label: 'Pending',
    icon: require('assets/icons/hour_glass.png'),
  },
  [SchemaTypes.dealState.REJECTED]: {
    color: Colors.red,
    label: 'Rejected',
    icon: require('assets/icons/close_circle_outline.png'),
  },
};

const DealState = (props) => {
  const {style, iconStyle, textStyle, state} = props;

  const styles = useStyle();

  const currentStatus = dealStates[state] || {};

  return (
    <View style={[styles.container, style]}>
      <Image
        style={[styles.icon, iconStyle, {tintColor: currentStatus?.color}]}
        source={currentStatus?.icon}
      />
      <Text style={[styles.textLabel, textStyle, {color: currentStatus?.color}]}>
        {currentStatus?.label}
      </Text>
    </View>
  );
};

DealState.displayName = 'DealState';

export default DealState;

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
