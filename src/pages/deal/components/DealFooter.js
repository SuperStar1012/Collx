import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import DealFooterDescription from './DealFooterDescription';
import DealFooterActions from './DealFooterActions';

import {SchemaTypes} from 'globals';

const DealFooter = ({
  style,
  viewer,
  deal,
  onCheckout,
  onViewOrderDetail,
  onAcceptOffer,
  onRejectOffer,
  onBuyItNow,
  onMessage,
  onRenewDeal,
}) => {
  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment DealFooter_deal on Deal {
      id
      buyer {
        id
      }
      seller {
        id
      }
      ...DealFooterDescription_deal
      ...DealFooterActions_deal
    }`,
    deal
  );

  const viewerData = useFragment(graphql`
    fragment DealFooter_viewer on Viewer {
      profile {
        id
        ...DealFooterActions_profile
      }
    }`,
    viewer
  );

  const dealWithMe = useMemo(() => {
    if (dealData.buyer?.id === viewerData.profile.id) {
      return SchemaTypes.dealsWithMeAs.BUYER;
    } else if (dealData.seller?.id === viewerData.profile.id) {
      return SchemaTypes.dealsWithMeAs.SELLER;
    }
    return SchemaTypes.dealsWithMeAs.EITHER;
  }, [dealData.buyer?.id, dealData.seller?.id, viewerData.profile.id]);

  return (
    <View style={[styles.container, style]}>
      <DealFooterDescription
        deal={dealData}
        dealWithMe={dealWithMe}
      />
      <DealFooterActions
        profile={viewerData.profile}
        deal={dealData}
        dealWithMe={dealWithMe}
        onCheckout={onCheckout}
        onViewOrderDetail={onViewOrderDetail}
        onAcceptOffer={onAcceptOffer}
        onRejectOffer={onRejectOffer}
        onBuyItNow={onBuyItNow}
        onMessage={onMessage}
        onRenewDeal={onRenewDeal}
      />
    </View>
  );
};

export default DealFooter;

const useStyle = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
  });
