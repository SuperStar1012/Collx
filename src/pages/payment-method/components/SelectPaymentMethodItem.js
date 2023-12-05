import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  Button,
} from 'components';

import {createUseStyle, useTheme} from 'theme';
import {Constants} from 'globals';

const ellipsisIcon = require('assets/icons/ellipsis.png');

const SelectPaymentMethodItem = (props) => {
  const {
    payment,
    disabled,
    onSelect,
    onEdit,
  } = props;

  const {type} = payment;

  const styles = useStyle();
  const {t: {icons}} = useTheme();

  const handleSelect = () => {
    if (onSelect) {
      onSelect(payment);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(payment);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={handleSelect}
    >
      <View style={styles.contentContainer}>
        <Image
          style={styles.iconPayment}
          source={icons.paymentMethodIcons[payment[type].brand] || icons.paymentMethodIcons.default}
        />
        <Text style={styles.textValue}>
          {payment[type].label ? payment[type].label : `•••• ${payment[type].last4}`}
        </Text>
      </View>
      {(payment.id !== Constants.extraPaymentMethods.apple.id && payment.id !== Constants.extraPaymentMethods.google.id) ? (
        <Button
          style={styles.actionButton}
          icon={ellipsisIcon}
          iconStyle={styles.iconEllipsis}
          scale={Button.scaleSize.Four}
          onPress={handleEdit}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
    backgroundColor: colors.primaryCardBackground,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPayment: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 8,
  },
  actionButton: {
  },
  iconEllipsis: {
    width: 28,
    height: 28,
    tintColor: colors.grayText,
  },
}));

export default SelectPaymentMethodItem;
