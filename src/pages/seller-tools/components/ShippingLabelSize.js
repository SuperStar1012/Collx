import React from 'react';
import {View, Text} from 'react-native';

import {
  Check,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const labelSizes = [
  {
    label: '8.5”x 11”',
    description: 'This paper size works for most standard printers',
    value: SchemaTypes.shippingLabelSize.EIGHT_AND_A_HALF_BY_ELEVEN,
  },
  {
    label: '4”x 6”',
    description: 'This paper size only works for specialized label printers with 4” wide paper”',
    value: SchemaTypes.shippingLabelSize.FOUR_BY_SIX,
  },
];

const ShippingLabelSize = ({
  value,
  onChangeValue,
}) => {

  const styles = useStyle();

  const handleChangeLabelSettings = value => {
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textSectionTitle}>Label Size</Text>
      {
        labelSizes.map((item, index) => (
          <Check
            key={index}
            style={styles.labelSettingsItemContainer}
            label={item.label}
            description={item.description}
            value={value === item.value}
            onChangedValue={() => handleChangeLabelSettings(item.value)}
          />
        ))
      }
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 20,
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
  labelSettingsItemContainer: {
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: colors.secondaryBorder,
    borderBottomWidth: 1,
  },
}));

export default ShippingLabelSize;
