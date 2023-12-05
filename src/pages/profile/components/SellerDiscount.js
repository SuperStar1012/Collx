import React from 'react';
import {View, Text, Image} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {createUseStyle} from 'theme';

const exclamationIcon = require('assets/icons/exclamation_circle.png')

const SellerDiscount = ({
  style,
  profile,
}) => {

  const styles = useStyle();

  const profileData = useFragment(
    graphql`
      fragment SellerDiscount_profile on Profile {
        flags
        orderShipmentDetails {
          sellerDiscount {
            percentage
            priceBreakAt {
              amount
              formattedAmount
            }
          }
        }
      }
    `,
    profile,
  );

  const {percentage, priceBreakAt} = profileData.orderShipmentDetails?.sellerDiscount || {};
  const {marketplace} = profileData.flags || {};

  if (!marketplace || !(percentage && Number(priceBreakAt.amount || 0))) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Image style={styles.iconInfo} source={exclamationIcon} />
        <Text style={[styles.text, styles.textTitle]}>Seller Discount</Text>
      </View>
      <Text style={[styles.text, styles.textInfo]}>
        {`${percentage || 0}% off on orders of ${priceBreakAt?.formattedAmount || '$0'} or more`}
      </Text>
    </View>
  );
};

export default SellerDiscount;

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
  iconInfo: {
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
