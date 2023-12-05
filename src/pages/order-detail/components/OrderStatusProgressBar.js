import React, { useMemo } from 'react';
import {Text, View, FlatList} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import moment from 'moment';

import {createUseStyle, useTheme} from 'theme';
import {Constants, Orders, SchemaTypes} from 'globals';

const itemHeight = 70;

const normalShipmentStates = [
  SchemaTypes.orderState.AWAITING_SHIPMENT_DETAILS,
  SchemaTypes.orderState.SHIPPING_DETAILS_PROVIDED,
  SchemaTypes.orderState.TRANSFERRED_TO_CARRIER,
  SchemaTypes.orderState.DELIVERED,
  SchemaTypes.orderState.COMPLETED,
];

const refundShipmentStates = [
  SchemaTypes.orderState.REFUND_REQUESTED,
  SchemaTypes.orderState.RETURN_DETAILS_PROVIDED,
  SchemaTypes.orderState.RETURN_IN_TRANSIT,
  SchemaTypes.orderState.RETURN_DELIVERED,
  SchemaTypes.orderState.REFUND_COMPLETED,
];

const OrderStatusProgressBar = ({
  style,
  order,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const orderData = useFragment(graphql`
    fragment OrderStatusProgressBar_order on Order {
      state
      stateGroup
      timeline(first: 20) {
        edges {
          node {
            id
            createdAt
            toState
          }
        }
      }
    }`,
    order
  );

  const getTime = (orderState) => {
    if (orderData.timeline?.edges?.length) {
      const matchState = orderData.timeline.edges.find(({node}) => node.toState === orderState);
      if (matchState) {
        return matchState.node.createdAt;
      }
    }

    return null;
  };

  const progressValues = useMemo(() => {
    const shipmentStates = {};

    const possibleStates = orderData.stateGroup !== SchemaTypes.orderStateGroup.DISPUTED ? normalShipmentStates : refundShipmentStates;

    const stateIndex = possibleStates.indexOf(orderData.state);
    if (stateIndex > -1) {
      possibleStates.map((key, index) => {
        const timeline = getTime(key);
        if (timeline && index <= stateIndex) {
          shipmentStates[key] = Orders.orderStates()[key];
        }
      });
    }

    const shipmentStateKeys = Object.keys(shipmentStates);
    const height = shipmentStateKeys.length * itemHeight;

    return ({
      statusIndex: Object.keys(shipmentStates).length - 1,
      shipmentStates,
      height,
    })
  }, [colors, orderData.state, orderData.stateGroup]);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.textTitle}>
        {progressValues.shipmentStates[item]?.shortLabel}
      </Text>
      {item !== SchemaTypes.orderState.TRANSFERRED_TO_CARRIER && getTime(item) ? (
        <Text style={styles.textSubTitle}>
          {`${progressValues.shipmentStates[item].longLabel} on ${moment(getTime(item)).format(Constants.orderStatusDateFormat)}`}
        </Text>
      ) : null}
    </View>
  );

  if (progressValues.statusIndex === -1) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progressBar,
          {
            height: progressValues.statusIndex === 0 ? 8 : progressValues.height - Math.round(itemHeight / 3),
            marginTop: progressValues.statusIndex === 0 ? 6 : 0,
          }
        ]}
      />
      <FlatList
        style={styles.contentContainer}
        scrollEnabled={false}
        data={Object.keys(progressValues.shipmentStates)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default OrderStatusProgressBar;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    marginTop: 16,
  },
  progressBar: {
    width: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  contentContainer: {
    marginLeft: 13,
  },
  itemContainer: {
    width: '100%',
    height: itemHeight,
  },
  textTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textSubTitle: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginTop: 6,
  },
}));
