import React, { useMemo } from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  Button,
} from 'components';

import {Fonts, createUseStyle} from 'theme';
import {getPrice, getChargeBreakdownValue} from 'utils';
import {useActions} from 'actions';
import {SchemaTypes} from 'globals';

const chevronIcon = require('assets/icons/chevron_forward.png');

const PricesInfoForBuyer = (props) => {
  const {
    isCheckout,
    isVisibleFull,
    onAddShippingAddress,
  } = props;

  const styles = useStyle();
  const actions = useActions();

  const orderData = useFragment(graphql`
    fragment PricesInfoForBuyer_order on Order {
      id
      shippingAddress {
        id
      }
      seller {
        orderShipmentDetails {
          description
          paidBy
        }
      }
      chargeBreakdown {
        type
        value {
          amount
          formattedAmount
        }
      }
      shippingIsPaidBy
    }`,
    props.order
  );

  if (!orderData) {
    return null;
  }

  const chargePrices = useMemo(() => ({
    creditApplied: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.CREDIT_APPLIED),
    balanceApplied: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.BALANCE_APPLIED),
    discount: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.DISCOUNT),
    merchandise: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.MERCHANDISE_VALUE),
    shipping: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.SHIPPING_COST),
    shippingDiscount: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.SHIPPING_DISCOUNT),
    tax: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.TAX),
    subTotal: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.SUBTOTAL),
    dueAtCheckout: getChargeBreakdownValue(orderData.chargeBreakdown, SchemaTypes.orderChargeBreakdownItemType.DUE_AT_CHECKOUT),
  }), [orderData.chargeBreakdown]);

  const handleAddAddress = () => {
    if (onAddShippingAddress) {
      onAddShippingAddress();
    }
  };

  const handleEditCreditApplied = () => {
    // const chargePrices.subTotal = Number(chargePrices.merchandise?.amount || 0) + Number(chargePrices.shipping?.amount || 0) + Number(chargePrices.tax?.amount || 0);
    actions.navigateApplyPrice({
      orderId: orderData.id,
      orderTotal: chargePrices.dueAtCheckout.amount || 0,
      amount: chargePrices.creditApplied?.amount || 0,
      priceType: SchemaTypes.orderChargeBreakdownItemType.CREDIT_APPLIED,
    });
  };

  const handleEditBalanceApplied = () => {
    // const chargePrices.subTotal = Number(chargePrices.merchandise?.amount || 0) + Number(chargePrices.shipping?.amount || 0) + Number(chargePrices.tax?.amount || 0);
    actions.navigateApplyPrice({
      orderId: orderData.id,
      orderTotal: chargePrices.dueAtCheckout.amount || 0,
      amount: chargePrices.balanceApplied?.amount || 0,
      priceType: SchemaTypes.orderChargeBreakdownItemType.BALANCE_APPLIED,
    });
  };

  const renderOrderDetailApplied = () => {
    if (isCheckout || !isVisibleFull) {
      return null;
    }

    return (
      <>
        {chargePrices.creditApplied?.amount > 0 ? (
          <PriceField
            label="CollX Credit Applied"
            value={`-${chargePrices.creditApplied.formattedAmount}`}
          />
        ) : null}
        {chargePrices.balanceApplied?.amount > 0 ? (
          <PriceField
            label="Balance Applied"
            value={`-${chargePrices.balanceApplied.formattedAmount}`}
          />
        ) : null}
      </>
    );
  };

  const renderDiscount = () => {
    if (!isVisibleFull || !chargePrices.discount || !chargePrices.discount.amount) {
      return null;
    }

    return (
      <PriceField
        label="Discount"
        value={`-${chargePrices.discount?.formattedAmount || getPrice(0)}`}
      />
    );
  };

  const renderCheckoutApplied = () => {
    if (!isCheckout) {
      return null;
    }

    return (
      <>
        <PriceField label="CollX Credit Applied">
          <AppliedEditButton
            value={chargePrices.creditApplied?.formattedAmount}
            onPress={handleEditCreditApplied}
          />
        </PriceField>
        <PriceField label="Balance Applied">
          <AppliedEditButton
            value={chargePrices.balanceApplied?.formattedAmount}
            onPress={handleEditBalanceApplied}
          />
        </PriceField>
      </>
    );
  };

  const renderShippingPrice = () => {
    // if (orderData.shippingIsPaidBy === SchemaTypes.orderShippingIsPaidBy.SELLER) {
    //   return null;
    // }

    if (!isCheckout || chargePrices.shipping || chargePrices.shippingDiscount) {
      const shippingAmount = Number(chargePrices.shipping?.amount) || 0;
      const shippingDiscountAmount = Number(chargePrices.shippingDiscount?.amount) || 0;

      if (shippingAmount === shippingDiscountAmount) {
        return (
          <PriceField
            label="Shipping"
            value="Free"
          />
        );
      }

      if (shippingAmount || shippingDiscountAmount) {
        return (
          <>
            {shippingAmount ? (
              <PriceField
                label="Shipping"
                value={chargePrices.shipping?.formattedAmount}
              />
            ) : null}
            {shippingDiscountAmount ? (
              <PriceField
                label="Shipping Discount"
                value={`-${chargePrices.shippingDiscount?.formattedAmount}`}
              />
            ) : null}
          </>
        );
      }
    }

    if (orderData.shippingIsPaidBy === SchemaTypes.orderShippingIsPaidBy.BUYER) {
      return (
        <PriceField label="Shipping">
          <AddAddressButton
            onPress={handleAddAddress}
          />
        </PriceField>
      );
    }

    return null;
  };

  const renderTaxPrice = () => {
    if (isCheckout && !orderData.shippingAddress) {
      return (
        <PriceField label="Tax">
          <AddAddressButton
            onPress={handleAddAddress}
          />
        </PriceField>
      );
    }

    if (!chargePrices.tax || Number(chargePrices.tax.amount) === 0) {
      return null;
    }

    return (
      <PriceField
        label="Tax"
        value={chargePrices.tax?.formattedAmount || getPrice(0)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <PriceField
        label="Price"
        value={chargePrices.merchandise?.formattedAmount}
      />
      {renderOrderDetailApplied()}
      {renderDiscount()}
      {renderShippingPrice()}
      {renderTaxPrice()}
      {renderCheckoutApplied()}
      <PriceField
        label={isCheckout ? 'Total' : 'Total Charged'}
        labelStyle={styles.textTotal}
        value={chargePrices.dueAtCheckout?.formattedAmount}
        valueStyle={styles.textPrice}
      />
    </View>
  );
};

const PriceField = ({
  label,
  labelStyle = {},
  value,
  valueStyle = {},
  children,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.rowContainer}>
      <Text style={[styles.textItem, labelStyle]}>{label}</Text>
      {children ? children : (
        <Text style={[styles.textItem, valueStyle]}>{value}</Text>
      )}
    </View>
  );
};

const AddAddressButton = ({onPress}) => {
  const styles = useStyle();

  return (
    <Button
      style={styles.addAddressButton}
      label="Add address"
      labelStyle={styles.textAddAddressButton}
      scale={Button.scaleSize.Two}
      onPress={onPress}
    />
  );
};

const AppliedEditButton = ({
  value,
  onPress,
}) => {
  const styles = useStyle();

  return (
    <Button
      style={styles.editButton}
      label={value ? `-${value}` : "Tap to edit"}
      labelStyle={styles.textValueButton}
      icon={chevronIcon}
      iconStyle={styles.iconChevron}
      scale={Button.scaleSize.Two}
      onPress={onPress}
    />
  );
};

export default PricesInfoForBuyer;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.quaternaryBorder,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  textItem: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
  },
  textTotal: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textPrice: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primary,
  },
  addAddressButton: {
    paddingVertical: 5,
  },
  textAddAddressButton: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    textTransform: 'capitalize',
    color: colors.primary,
  },
  editButton: {
    flexDirection: 'row-reverse',
    marginLeft: -5,
  },
  textValueButton: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    textTransform: 'capitalize',
    color: colors.primary,
  },
  iconChevron: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
  },
}));
