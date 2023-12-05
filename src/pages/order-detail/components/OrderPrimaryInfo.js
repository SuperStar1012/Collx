import React from 'react';
import {View, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import moment from 'moment';

import {CheckoutState} from 'components';
import CopyValue from './CopyValue';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const OrderPrimaryInfo = ({
  order
}) => {

  const styles = useStyle();

  const orderData = useFragment(graphql`
    fragment OrderPrimaryInfo_order on Order {
      state
      date
      number
    }`,
    order
  );

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.textFieldName}>Order Date</Text>
        <Text style={styles.textFieldValue}>
          {orderData.date && moment(orderData.date).format(Constants.dateFormat)}
        </Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.textFieldName}>Order Number</Text>
        <CopyValue
          value={orderData.number}
          copyDescription="Order Number Copied"
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.textFieldName}>Order Status</Text>
        <CheckoutState state={orderData.state} />
      </View>
    </View>
  );
};

export default OrderPrimaryInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textFieldValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
}));
