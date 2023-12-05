import React, {useMemo} from 'react';
import {Text, View, Image} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle, useTheme} from 'theme';
import {Orders, SchemaTypes} from 'globals';

const timelineItemReason = {
  [SchemaTypes.timelineItemReason.CANCELLED_BY_BUYER]: 'Canceled by buyer',
  [SchemaTypes.timelineItemReason.CANCELLED_BY_SELLER]: 'Canceled by seller',
  [SchemaTypes.timelineItemReason.NO_PAYMENT_RECEIVED]: 'No payment received',
};

const OrderStatusSummary = ({
  style,
  order,
}) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const orderData = useFragment(graphql`
    fragment OrderStatusSummary_order on Order {
      state
      timeline(first: 20) {
        edges {
          node {
            toState
            reason
          }
        }
      }
    }`,
    order
  );

  const {state, timeline} = orderData || {};

  const currentState = useMemo(() => Orders.orderStates(colors)[state], [state, colors]);

  const cancelReason = useMemo(() => {
    if (state !== SchemaTypes.orderState.CANCELLED) {
      return null;
    }

    const cancelNode = timeline.edges.find(item => item.node.toState === SchemaTypes.orderState.CANCELLED);
    if (!cancelNode) {
      return null;
    }

    return cancelNode.node.reason;
  }, [state, timeline]);

  if (!currentState) {
    return null;
  }

  return (
    <View style={[styles.container, style, {backgroundColor: currentState.backgroundColor}]}>
      <Image
        style={[styles.icon, {tintColor: currentState.color}]}
        source={currentState.longIcon || currentState.icon}
      />
      <View style={styles.textsContainer}>
        <Text style={[styles.textLabel, {color: currentState.color}]}>
          {currentState.longLabel}
        </Text>
        {cancelReason ? (
          <Text style={[styles.textReason, {color: currentState.color}]}>
            {timelineItemReason[cancelReason]}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default OrderStatusSummary;

const useStyle = createUseStyle(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    borderRadius: 19,
  },
  icon: {
    width: 24,
    height: 24,
  },
  textsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
  },
  textLabel: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  textReason: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
}));
