import React from 'react';
import {View, Text} from 'react-native';

import {
  TextInputUnit,
} from 'components';

import {createUseStyle} from 'theme';

const ShippingCost = ({
  value,
  onChangeValue,
}) => {

  const styles = useStyle();

  const handleChangeValue = (text) => {
    if (onChangeValue) {
      onChangeValue(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionLeftContentContainer}>
        <Text style={styles.textTitle}>
          Shipping Cost
        </Text>
        <TextInputUnit
          style={styles.textInputContainer}
          autoCorrect={false}
          autoCapitalize="none"
          unitPrefix="$"
          value={value}
          onChangeText={handleChangeValue}
        />
      </View>
      <Text style={styles.textDescription}>
        Indicate your standard cost to ship cards. Shipping for all your orders will be set to this price.
      </Text>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryCardBackground,
    marginTop: 20,
  },
  sectionLeftContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textTitle: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginRight: 10,
  },
  textInputContainer: {
    width: 90,
    height: 32,
    borderRadius: 2,
    paddingHorizontal: 7,
    backgroundColor: colors.secondaryCardBackground,
  },
}));

export default ShippingCost;
