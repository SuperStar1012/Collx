import React, { useMemo } from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';
import {getChargeBreakdownValue} from 'utils';
import {SchemaTypes} from 'globals';

const PricesInfoForSeller = ({
  style,
  order
}) => {
  const styles = useStyle();

  const orderData = useFragment(graphql`
    fragment PricesInfoForSeller_order on Order {
      id
      proceedsBreakdown {
        type
        value {
          amount
          formattedAmount
        }
      }
    }`,
    order
  );

  if (!orderData) {
    return null;
  }

  const proceedsPrices = useMemo(() => ({
    collxFee: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.COLLX_FEE),
    discount: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.DISCOUNT),
    merchandise: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.MERCHANDISE_VALUE),
    proceeds: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.PROCEEDS),
    shippingCost: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.SHIPPING_COST),
    shippingSurcharge: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.SHIPPING_SURCHARGE),
    subTotal: getChargeBreakdownValue(orderData.proceedsBreakdown, SchemaTypes.orderProceedsBreakdownItemType.SUBTOTAL),
  }), [orderData.proceedsBreakdown]);

  const renderPrice = () => {
    if (!proceedsPrices.merchandise?.amount) {
      return null;
    }

    return (
      <PriceField
        label="Price"
        value={proceedsPrices.merchandise?.formattedAmount}
      />
    );
  };

  const renderDiscount = () => {
    if (!proceedsPrices.discount?.amount) {
      return null;
    }

    return (
      <PriceField
        label="Discount"
        value={`-${proceedsPrices.discount.formattedAmount}`}
      />
    );
  };

  const renderShippingCost = () => {
    if (!proceedsPrices.shippingCost?.amount) {
      return null;
    }

    return (
      <PriceField
        label="Shipping Cost"
        value={`-${proceedsPrices.shippingCost.formattedAmount}`}
      />
    );
  };

  const renderSubtotal = () => {
    if (!proceedsPrices.subTotal?.amount) {
      return null;
    }

    return (
      <PriceField
        label="Subtotal"
        value={proceedsPrices.subTotal.formattedAmount}
      />
    );
  };

  const renderCollXFee = () => {
    if (!proceedsPrices.collxFee?.amount) {
      return null;
    }

    return (
      <PriceField
        label="CollX Fee"
        value={`-${proceedsPrices.collxFee.formattedAmount}`}
      />
    );
  };

  const renderShippingPayment = () => {
    if (!proceedsPrices.shippingSurcharge?.amount) {
      return null;
    }

    return (
      <PriceField
        label="Shipping Payment"
        value={`-${proceedsPrices.shippingSurcharge.formattedAmount}`}
      />
    );
  };

  const renderProceeds = () => {
    if (!proceedsPrices.proceeds?.amount) {
      return null;
    }

    return (
      <PriceField
        label="Proceeds"
        labelStyle={styles.textTotal}
        value={proceedsPrices.proceeds?.formattedAmount}
        valueStyle={styles.textPrice}
      />
    );
  };


  return (
    <View style={[styles.container, style]}>
      {renderPrice()}
      {renderDiscount()}
      {renderShippingCost()}
      {renderSubtotal()}
      {renderCollXFee()}
      {renderShippingPayment()}
      {renderProceeds()}
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

export default PricesInfoForSeller;

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
}));
