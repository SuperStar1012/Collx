import React from 'react';
import {View, Text} from 'react-native';

import {
  Switch,
} from 'components';

import {Fonts, createUseStyle} from 'theme';

const ShippingPackingSlip = ({
  value,
  onChangeValue,
}) => {
  const styles = useStyle();

  const handleChangeValue = (newValue) => {
    if (onChangeValue) {
      onChangeValue(newValue);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textSectionTitle}>
        Packing slip
      </Text>
      <View style={styles.sectionContentContainer}>
        <View style={styles.sectionLeftContentContainer}>
          <Text style={styles.textTitle}>
            Packing Slip
          </Text>
          <Text style={styles.textDescription}>
            A list of all items purchased will be generated and sent once items are sold
          </Text>
        </View>
        <Switch
          style={styles.switchPackingSlip}
          value={value}
          onChangedValue={handleChangeValue}
        />
      </View>
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 20,
  },
  sectionContentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryCardBackground,
  },
  sectionLeftContentContainer: {
    flex: 1,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
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
  switchPackingSlip: {
    height: 40,
  },
}));

export default ShippingPackingSlip;
