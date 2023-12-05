import React, {forwardRef} from 'react';
import {graphql, useFragment} from 'react-relay';
import {StyleSheet, View, Alert} from 'react-native';

import {
  DealUser,
  SellerDiscountInfo,
  SellerMinimumInfo,
  SellerShippingInfo,
} from 'components';
import DealList from './DealList';
import MoreList from './MoreList';

import {useActions} from 'actions';
import {SchemaTypes} from 'globals';

const DealDetail = forwardRef(({
  deal,
  viewer,
  onAddCard,
  onRemoveCard,
  onSaveForLater,
  onMessage,
}, ref) => {

  const actions = useActions();
  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment DealDetail_deal on Deal {
      id
      state
      seller {
        id
        name
        ...DealUser_other_profile
      }
      buyer {
        id
        ...DealUser_other_profile
      }
      ...SellerDiscountInfo_deal
      ...SellerMinimumInfo_deal
      ...SellerShippingInfo_deal
      ...DealList_deal
      ...MoreList_deal
    }`,
    deal
  );

  const viewerData = useFragment(graphql`
    fragment DealDetail_viewer on Viewer {
      profile {
        id
        ...DealUser_my_profile
        ...SellerDiscountInfo_profile
        ...SellerMinimumInfo_profile
        ...SellerShippingInfo_profile
      }
    }`,
    viewer
  );

  const handleSaveForLater = (tradingCardId) => {
    if (onSaveForLater) {
      onSaveForLater([tradingCardId], true, dealData.id);
    }
  };

  const handleRemoveCard = (sellerId, tradingCardId) => {
    if (onRemoveCard) {
      onRemoveCard(sellerId, [tradingCardId]);
    }
  };

  const handleAddCard = (sellerId, tradingCardId) => {
    if (onAddCard) {
      onAddCard(sellerId, [tradingCardId]);
    }
  };

  const handleSelectCard = (tradingCardId) => {
    actions.pushTradingCardDetail(tradingCardId);
  };

  const handleContactSeller = () => {
    if (onMessage) {
      onMessage(
        viewerData.profile?.id,
        dealData.seller?.id,
      );
    }
  };

  const handleAskSeller = () => {
    Alert.alert(
      'Seller needs to add address',
      'Please contact seller to add their shipping address before you can complete checkout.',
      [
        {
          text: 'Contact Seller',
          onPress: handleContactSeller,
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const isMeBuyer = dealData.buyer?.id === viewerData.profile.id;

  const renderSellerInfo = () => {
    if (
      !isMeBuyer ||
      dealData.state === SchemaTypes.dealState.CANCELLED ||
      dealData.state === SchemaTypes.dealState.COMPLETED ||
      dealData.state === SchemaTypes.dealState.EXPIRED ||
      dealData.state === SchemaTypes.dealState.REJECTED
    ) {
      return null;
    }

    return (
      <>
        <SellerDiscountInfo
          profile={viewerData.profile}
          deal={dealData}
        />
        <SellerMinimumInfo
          profile={viewerData.profile}
          deal={dealData}
        />
        <SellerShippingInfo
          profile={viewerData.profile}
          deal={dealData}
          onContactSeller={handleAskSeller}
        />
      </>
    );
  };

  const renderMoreList = () => {
    if (!isMeBuyer || dealData.state !== SchemaTypes.dealState.PENDING) {
      return null;
    }

    return (
      <MoreList
        ref={ref}
        viewer={viewer}
        deal={dealData}
        sellerName={dealData.seller.name}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
        onSelectCard={handleSelectCard}
      />
    );
  };

  return (
    <View style={styles.container}>
      <DealUser
        isMeBuyer={isMeBuyer}
        myProfile={viewerData.profile}
        otherProfile={isMeBuyer ? dealData.seller : dealData.buyer}
        onMessage={onMessage}
      />
      {renderSellerInfo()}
      <DealList
        isMeBuyer={isMeBuyer}
        deal={dealData}
        onSelectCard={handleSelectCard}
        onSaveForLater={handleSaveForLater}
        onRemoveCard={handleRemoveCard}
      />
      {renderMoreList()}
    </View>
  );
});

DealDetail.displayName = 'DealDetail';

export default DealDetail;

const useStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
