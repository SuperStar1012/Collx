import React from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle} from 'theme';

const exclamationIcon = require('assets/icons/exclamation_circle.png')

const SellerDiscountInfo = ({
  style,
  profile,
  deal,
}) => {

  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment SellerDiscountInfo_deal on Deal {
      sellerDiscount {
        percentage
        priceBreakAt {
          amount
          formattedAmount
        }
      }
    }`,
    deal
  );

  const myProfileData = useFragment(
    graphql`
      fragment SellerDiscountInfo_profile on Profile {
        flags
      }
    `,
    profile,
  );

  const {marketplace} = myProfileData.flags || {};

  if (!marketplace) {
    return null;
  }

  if (!dealData?.sellerDiscount) {
    return null;
  }

  const {percentage, priceBreakAt} = dealData.sellerDiscount || {};

  if (!percentage && !Number(priceBreakAt?.amount || 0)) {
    return;
  }

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.iconInfo} source={exclamationIcon} />
      <View style={styles.infoContainer}>
        <Text style={styles.textDescription}>
          {`${percentage || 0}% off on orders of ${priceBreakAt?.formattedAmount || '$0'} or more`}
        </Text>
      </View>
    </View>
  );
};

export default SellerDiscountInfo;

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
