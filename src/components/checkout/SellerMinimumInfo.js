import React from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle} from 'theme';

const exclamationIcon = require('assets/icons/exclamation_circle.png')

const SellerMinimumInfo = ({
  style,
  profile,
  deal,
}) => {

  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment SellerMinimumInfo_deal on Deal {
      seller {
        flags
        orderShipmentDetails {
          sellerMinimum
        }
      }
    }`,
    deal
  );

  const myProfileData = useFragment(
    graphql`
      fragment SellerMinimumInfo_profile on Profile {
        flags
      }
    `,
    profile,
  );

  const {marketplace: buyerMarketplace} = myProfileData.flags || {};
  const {marketplace: sellerMarketplace} = dealData.seller?.flags || {};
  const {sellerMinimum} = dealData.seller?.orderShipmentDetails || {};

  if (!buyerMarketplace || !sellerMarketplace || !sellerMinimum) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconInfo} source={exclamationIcon} />
      <View style={styles.infoContainer}>
        <Text style={styles.textDescription}>
          Seller minimum of ${((sellerMinimum || 0) / 100).toFixed(2)} per order
        </Text>
      </View>
    </View>
  );
};

export default SellerMinimumInfo;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: colors.secondaryCardBackground,
  },
  iconInfo: {
    width: 22,
    height: 22,
    tintColor: colors.shippingInfoColor,
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
    color: colors.shippingInfoColor,
  },
}));
