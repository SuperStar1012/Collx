import React from 'react';
import {View, Text} from 'react-native';

import {
  Check,
} from 'components';
import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const labelSettings = [
  {
    label: 'CollX will generate for me',
    value: SchemaTypes.shippingLabelGeneratedBy.COLLX,
  },
  {
    label: 'I’ll create my own shipping label',
    value: SchemaTypes.shippingLabelGeneratedBy.ME,
  },
];

const ShippingLabelSettings = ({
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
      <Text style={styles.textSectionTitle}>
        Label Settings
      </Text>
      {
        labelSettings?.map((item, index) => (
          <Check
            key={index}
            style={styles.itemContainer}
            label={item.label}
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
  itemContainer: {
    height: 44,
    backgroundColor: colors.primaryCardBackground,
    paddingHorizontal: 16,
    borderBottomColor: colors.secondaryBorder,
    borderBottomWidth: 1,
  },
}));

export default ShippingLabelSettings;
