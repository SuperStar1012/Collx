import React from 'react';
import {View, Text} from 'react-native';

import {
  Check,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes, Urls} from 'globals';
import {useActions} from 'actions';

const mailTypes = [
  {
    // LetterTrack
    label: 'Envelope',
    description: 'Tracked USPS standard envelope. $0.75 (1oz), $1.00 (2oz) or $1.25 (3oz). Over 3.5oz or $50 order value will ship as Package (see below).',
    value: SchemaTypes.shippingPackageType.ENVELOPE,
    link: Urls.envelopeHelpUrl,
  },
  {
    // EasyPost
    label: 'Package',
    description: 'Tracked USPS First Class parcel. $3.62-$5.74, up to 15oz.',
    value: SchemaTypes.shippingPackageType.PACKAGE,
    link: Urls.packageHelpUrl,
  },
];

const ShippingMailType = ({
  value,
  onChangeValue,
}) => {

  const styles = useStyle();
  const actions = useActions();

  const handleChangeLabelSettings = value => {
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  const handleHelp = (title, link) => {
    if (link) {
      actions.navigateWebViewer({
        title,
        url: link,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textSectionTitle}>
        Default Mail Type
      </Text>
      {
        mailTypes.map((item, index) => (
          <Check
            key={index}
            style={styles.labelSettingsItemContainer}
            label={item.label}
            description={item.description}
            value={value === item.value}
            onChangedValue={() => handleChangeLabelSettings(item.value)}
            onHelp={() => handleHelp(item.label, item.link)}
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

export default ShippingMailType;
