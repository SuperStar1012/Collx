import React from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle} from 'theme';

const shippingBoxIcon = require('assets/icons/shipping_box.png');

const SellerShipping = ({
  style,
  profile,
}) => {

  const styles = useStyle();

  const profileData = useFragment(
    graphql`
      fragment SellerShipping_profile on Profile {
        flags
        orderShipmentDetails {
          description
        }
      }
    `,
    profile,
  );

  const {marketplace} = profileData.flags || {};
  const {description} = profileData.orderShipmentDetails || {};

  if (!marketplace || !description) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Image style={styles.iconShipping} source={shippingBoxIcon} />
        <Text style={[styles.text, styles.textTitle]}>Shipping Info</Text>
      </View>
      <Text style={[styles.text, styles.textInfo]}>
        {description}
      </Text>
    </View>
  );
};

export default SellerShipping;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.secondaryCardBackground,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconShipping: {
    width: 24,
    height: 24,
    tintColor: colors.grayText,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  textTitle: {
    color: colors.grayText,
    marginLeft: 4,
  },
  textInfo: {
    color: colors.primaryText,
    marginTop: 8,
  },
}));
