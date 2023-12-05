import React from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const OrderDescription = (props) => {
  const {isMeBuyer} = props;

  const styles = useStyle();

  const orderData = useFragment(graphql`
    fragment OrderDescription_order on Order {
      state
      stateGroup
      shipmentDetails {
        trackingNumber
        postageLabelUrl
      }
    }`,
    props.order
  );

  if (orderData.state === SchemaTypes.orderState.CREATED || orderData.state === SchemaTypes.orderState.AWAITING_PAYMENT) {
    return null;
  }

  // both Buyer and Seller
  if (orderData.state === SchemaTypes.orderState.REFUND_REQUESTED) {
    return (
      <View style={styles.container}>
        <Text style={styles.textDescription}>
          An issue has been reported with this Order. CollX has paused any payments, and will review the matter. Contact us below with any additional information or questions.
        </Text>
      </View>
    );
  }

  // Buyer
  if (isMeBuyer) {
    if (orderData.state === SchemaTypes.orderState.COMPLETED || orderData.state === SchemaTypes.orderState.REFUND_COMPLETED) {
      return null;
    } else if (orderData.state === SchemaTypes.orderState.RETURN_DELIVERED) {
      return (
        <View style={styles.container}>
          <Text style={styles.textDescription}>
            Waiting for the seller to confirm receipt of the return package to issue refund.
          </Text>
          <Text style={[styles.textDescription, styles.textSecond]}>
            If the seller don’t take any action within 3 days of delivery, the return will be marked completed and refund released.
          </Text>
        </View>
      );
    } else if (orderData.stateGroup === SchemaTypes.orderStateGroup.DISPUTED) {
      if (orderData.shipmentDetails?.postageLabelUrl) {
        return (
          <View style={styles.container}>
            <Text style={styles.textDescription}>
              Tap the button below to download the return shipping label. You can download it directly or have it sent to your email. Once the package is shipped, we will automatically add the tracking code and keep both parties updated on the shipping status here.
            </Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.textDescription}>
          Please confirm you received your package and complete this order by tapping on the button below. If you don't take any action within 3 days of delivery or 30 days of shipping (if not tracked), the transaction will be marked complete and payment released.
        </Text>
      </View>
    );
  }

  // Seller
  if (orderData.stateGroup === SchemaTypes.orderStateGroup.ORDER_PLACED) {
    if (orderData.shipmentDetails?.postageLabelUrl) {
      return (
        <View style={styles.container}>
          <Text style={styles.textDescription}>
            Tap the button below to generate a shipping label for this order. You can choose to download it directly or have it sent to your email. Once the package is shipped, we will automatically add the tracking code and keep you updated on the shipping status here.
          </Text>
        </View>
      );
    } else if (!orderData.shipmentDetails?.trackingNumber) {
      return (
        <View style={styles.container}>
          <Text style={[styles.textDescription, styles.textTitle]}>
            Please add the tracking code of the package to ensure the receipt of it.
          </Text>
          <Text style={styles.textDescription}>
            If you don’t have a tracking code, please select “Manually Update Status” and update the status of this order so the buyer could see.
          </Text>
          <Text style={[styles.textDescription, styles.textSecond]}>
            If you wish CollX to generate shipping label for you and add tracking info automatically, please adjust your shipping label settings in Seller Tools.
          </Text>
        </View>
      );
    }
  } else if (orderData.state === SchemaTypes.orderState.DELIVERED) {
    return (
      <View style={styles.container}>
        <Text style={styles.textDescription}>
          Waiting for the buyer to confirm receipt of the package to complete this order.
        </Text>
        <Text style={[styles.textDescription, styles.textSecond]}>
          If the buyer don’t take any action within 3 days of delivery or 30 days of shipping (if not tracked), the transaction will be marked complete and payment released.
        </Text>
      </View>
    );
  } else if (orderData.state === SchemaTypes.orderState.RETURN_DELIVERED) {
    return (
      <View style={styles.container}>
        <Text style={styles.textDescription}>
          Please confirm you received the return package and complete this order by tapping on the button below. If you don't take any action within 3 days of delivery, the return will be marked completed and refund released.
        </Text>
      </View>
    );
  }

  return null;
};

export default OrderDescription;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 32,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
  },
  textSecond: {
    marginTop: 24,
  },
}));
