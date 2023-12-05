import React from 'react';
import {Text, View} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const ShipToItem = ({
  style,
  name,
  address1,
  address2,
  city,
  state,
  postalCode,
}) => {
  const styles = useStyle();

  const address = address1 + (address2 ? ` ${address2}` : '');

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textName}>{name}</Text>
      <Text style={styles.textAddress}>{address}</Text>
      <Text style={styles.textAddress}>{city}, {state} {postalCode}</Text>
    </View>
  );
}

export default ShipToItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
  },
  textName: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginBottom: 6,
  },
  textAddress: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
}));
