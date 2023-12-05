import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  Button,
} from 'components';
import OrderStatusSummary from './OrderStatusSummary';
import OrderStatusTracking from './OrderStatusTracking';

import {Fonts, createUseStyle} from 'theme';
import {SchemaTypes} from 'globals';

const ShipmentStatus = ({
  style,
  isMeBuyer,
  order,
  onEditTrackingCode,
}) => {
  const [isVisibleFull, setIsVisibleFull] = useState(true);

  const orderData = useFragment(graphql`
    fragment ShipmentStatus_order on Order {
      state
    }`,
    order
  );

  const styles = useStyle();

  const handleVisibleMode = () => {
    setIsVisibleFull(!isVisibleFull);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContainer}>
        <Text style={styles.textTitle}>Order Status</Text>
        {(orderData.state !== SchemaTypes.orderState.CREATED && orderData.state !== SchemaTypes.orderState.AWAITING_PAYMENT && orderData.state !== SchemaTypes.orderState.CANCELLED) ? (
          <Button
            label={isVisibleFull ? 'Hide Details' : 'View Full Details'}
            labelStyle={styles.textVisibleMode}
            scale={Button.scaleSize.One}
            onPress={handleVisibleMode}
          />
        ) : null}
      </View>
      <OrderStatusSummary order={order} />
      {orderData.state !== SchemaTypes.orderState.CANCELLED && isVisibleFull ? (
        <OrderStatusTracking
          order={order}
          isMeBuyer={isMeBuyer}
          onEditTrackingCode={onEditTrackingCode}
        />
      ) : null}
    </View>
  );
}

export default ShipmentStatus;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 13,
  },
  textTitle: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
  },
  textVisibleMode: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.primary,
  },
}));
