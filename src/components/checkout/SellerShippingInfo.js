import React from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {Button} from 'components';

import {Colors, createUseStyle} from 'theme';

const shippingBoxIcon = require('assets/icons/shipping_box.png');
const exclamationIcon = require('assets/icons/exclamation.png');

const SellerShippingInfo = ({
  style,
  profile,
  deal,
  onContactSeller,
}) => {

  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment SellerShippingInfo_deal on Deal {
      seller {
        flags
        orderShipmentDetails {
          description
          hasShippingAddress
        }
      }
    }`,
    deal
  );

  const myProfileData = useFragment(
    graphql`
      fragment SellerShippingInfo_profile on Profile {
        flags
      }
    `,
    profile,
  );

  const {marketplace: buyerMarketplace} = myProfileData.flags || {};
  const {marketplace: sellerMarketplace} = dealData.seller?.flags || {};
  const {hasShippingAddress} = dealData.seller?.orderShipmentDetails || {};

  const handleAskSeller = () => {
    if (onContactSeller) {
      onContactSeller();
    }
  };

  if (!buyerMarketplace) {
    return null;
  }

  if (sellerMarketplace && !hasShippingAddress) {
    return (
      <Button
        style={[styles.container, styles.warningContainer, style]}
        icon={exclamationIcon}
        iconStyle={[styles.iconBox, styles.iconWarning]}
        label="Seller needs to add address"
        labelStyle={[styles.textDescription, styles.textWarning]}
        scale={Button.scaleSize.One}
        onPress={handleAskSeller}
      />
    );
  }

  return (
    <View style={[styles.container, styles.shippingContainer, style]}>
      <Image
        style={[styles.iconBox, styles.iconShipping]}
        source={shippingBoxIcon}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.textDescription, styles.textShipping]}>
          {dealData.seller?.orderShipmentDetails?.description}
        </Text>
      </View>
    </View>
  );
};

export default SellerShippingInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 10,
  },
  shippingContainer: {
    backgroundColor: colors.secondaryCardBackground,
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: Colors.redAlphaHalf1,
  },
  iconBox: {
    width: 22,
    height: 22,
  },
  iconShipping: {
    tintColor: colors.shippingInfoColor,
  },
  iconWarning: {
    tintColor: Colors.red,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 2,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  textShipping: {
    color: colors.shippingInfoColor,
  },
  textWarning: {
    flex: 1,
    marginLeft: 2,
    color: Colors.red,
  },
}));
