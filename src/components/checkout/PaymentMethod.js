import React from 'react';
import {Text, View} from 'react-native';

import {
  Button,
  Image,
} from 'components';

import {Colors, Fonts, createUseStyle, useTheme} from 'theme';

const PaymentMethod = (props) => {
  const {
    style,
    isEditable,
    paymentMethod,
    onAddPaymentMethod,
    onChangePaymentMethod,
  } = props;

  const styles = useStyle();
  const {t: {icons}} = useTheme();

  const handleAddPaymentMethod = () => {
    if (onAddPaymentMethod) {
      onAddPaymentMethod();
    }
  };

  const handleChangePaymentMethod = () => {
    if (onChangePaymentMethod) {
      onChangePaymentMethod();
    }
  };

  const renderContent = () => {
    if (!paymentMethod) {
      return (
        <Button
          style={styles.addButton}
          label="Add Payment Method"
          labelStyle={styles.textAddButton}
          scale={Button.scaleSize.One}
          onPress={handleAddPaymentMethod}
        />
      );
    }

    const paymentValue = paymentMethod[paymentMethod.type];

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.paymentContainer}>
          <Image
            style={styles.iconPaymentMethod}
            source={icons.paymentMethodIcons[paymentValue.brand] || icons.paymentMethodIcons.default}
          />
          <Text style={styles.textCardNumber}>
            {paymentValue.label ? paymentValue.label : `•••• ${paymentValue.last4}`}
          </Text>
        </View>
        {isEditable ? (
          <Button
            style={styles.changeButton}
            label="Change"
            labelStyle={styles.textChangeButton}
            scale={Button.scaleSize.One}
            onPress={handleChangePaymentMethod}
          />
        ) : null}
      </View>
    );
  };

  if (!paymentMethod && !isEditable) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>Payment Method</Text>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
}

export default PaymentMethod;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 24,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 13,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopColor: colors.quaternaryBorder,
    borderTopWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
    borderBottomWidth: 1,
  },
  addButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
  },
  textAddButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
    color: colors.primary,
  },
  changeButton: {
    width: 80,
    height: 30,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray,
  },
  textChangeButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    letterSpacing: -0.24,
    textTransform: 'capitalize',
    color: Colors.gray,
  },
  iconPaymentMethod: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textCardNumber: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
