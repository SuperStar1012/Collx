import React from 'react';
import {View, Text, TextInput} from 'react-native';

import {createUseStyle, useTheme} from 'theme';

const ShippingInfo = ({
  value,
  onChangeValue,
}) => {

  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const handleChangeValue = (text) => {
    if (onChangeValue) {
      onChangeValue(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        Shipping Info
      </Text>
      <Text style={[styles.textDescription, styles.textShippingCostDescription]}>
        Indicate your shipping method and handling time
      </Text>
      <TextInput
        style={styles.textInputExpedited}
        autoCorrect={false}
        autoCapitalize="none"
        maxLength={50}
        underlineColorAndroid="transparent"
        placeholderTextColor={colors.placeholderText}
        placeholder="eg. Expedited (1-3 day)"
        value={value}
        onChangeText={handleChangeValue}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryCardBackground,
  },
  textTitle: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
    marginBottom: 6,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginRight: 10,
  },
  textInputExpedited: {
    height: 32,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 0,
    color: colors.primaryText,
    backgroundColor: colors.secondaryCardBackground,
    marginTop: 8,
  },
}));

export default ShippingInfo;
