import React from 'react';
import {View, Image, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Colors, createUseStyle} from 'theme';

const exclamationIcon = require('assets/icons/exclamation.png');

const CheckoutErrorView = ({
  orderViewer
}) => {
  const styles = useStyle();

  const orderViewerData = useFragment(graphql`
    fragment CheckoutErrorView_orderViewer on OrderViewer {
      reasonICantCheckout
    }`,
    orderViewer
  );

  const {reasonICantCheckout} = orderViewerData || {};

  if (!reasonICantCheckout) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.iconExclamation} source={exclamationIcon} />
      <Text style={styles.textDescription}>{reasonICantCheckout}</Text>
    </View>
  );
};

export default CheckoutErrorView;

const useStyle = createUseStyle(() => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: Colors.redAlpha1,
    borderRadius: 10,
  },
  iconExclamation: {
    width: 23,
    height: 23,
    tintColor: Colors.red,
    marginRight: 2,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.red,
  },
}));
