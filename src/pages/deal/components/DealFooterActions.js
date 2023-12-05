import React, {useMemo} from 'react';
import {View, Alert, Text} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {
  Button,
} from 'components';

import {Constants, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';
import {useActions} from 'actions';
import {getPrice, getCardPrice, showErrorAlert} from 'utils';

const DealFooterActions = ({
  profile,
  deal,
  dealWithMe,
  onCheckout,
  onViewOrderDetail,
  onAcceptOffer,
  onRejectOffer,
  onBuyItNow,
  onMessage,
  onRenewDeal,
}) => {
  const isMeBuyer = dealWithMe === SchemaTypes.dealsWithMeAs.BUYER;

  const styles = useStyle();
  const actions = useActions();

  const queryData = useFragment(graphql`
    fragment DealFooterActions_deal on Deal {
      id
      state
      seller {
        id
        status
        flags
        orderShipmentDetails {
          hasShippingAddress
        }
      }
      buyer {
        id
      }
      offer {
        madeBy
      }
      order {
        id
        state
      }
      tradingCards {
        id
        state
        listing {
          askingPrice {
            amount
            formattedAmount
          }
        }
      }
      chargeBreakdown {
        type
        value {
          amount
          formattedAmount
        }
      }
      viewer {
        canMakeOffer
      }
    }`,
    deal
  );

  const profileData = useFragment(graphql`
    fragment DealFooterActions_profile on Profile {
      id
      flags
    }`,
    profile
  );

  const {marketplace: buyerMarketplace} = profileData.flags || {};
  const {marketplace: sellerMarketplace} = queryData.seller?.flags || {};
  const {hasShippingAddress} = queryData.seller.orderShipmentDetails || {};
  const {status} = queryData.seller || {};

  const totalPrice = useMemo(() => {
    const totalItem = queryData.chargeBreakdown?.find(item => item.type === SchemaTypes.chargeBreakdownItemType.TOTAL);
    return totalItem?.value.formattedAmount;
  }, [queryData]);

  const totalCardsPrice = useMemo(() => {
    let totalPrice = 0;
    queryData.tradingCards?.forEach(card => {
      const price = getCardPrice(card);
      totalPrice += Number(price || 0);
    });

    return totalPrice.toFixed(2);
  }, [queryData.tradingCards]);

  // const timeIntervalRef = useRef(null);

  const isNoneAskingPrice = useMemo(() => {
    let value = false;
    queryData.tradingCards?.forEach(card => {
      if (!card.listing?.askingPrice?.amount) {
        value = true;
      }
    });

    return value;
  }, [queryData.tradingCards]);

  const isNoLongerAvailable = useMemo(() => {
    let value = false;

    if (queryData.state === SchemaTypes.dealState.ACCEPTED || queryData.state === SchemaTypes.dealState.COMPLETED) {
      return value
    }

    queryData.tradingCards?.forEach(card => {
      if (card?.state === SchemaTypes.tradingCardState.SOLD || card?.state === SchemaTypes.tradingCardState.NOT_FOR_SALE) {
        value = true;
      }
    });

    if (value) {
      showErrorAlert('Some items in this deal are no longer available.', 'Please remove them to continue.');
    }

    return value;
  }, [queryData.tradingCards]);

  const handleContactSeller = () => {
    if (onMessage) {
      onMessage(
        profileData.id,
        queryData.seller?.id,
      );
    }
  };

  const handleBuyNow = () => {
    if (status === Constants.userStatus.inactive) {
      Alert.alert(
        'Seller is inactive',
        'The seller has been inactive for more than 100 days. Please ensure that you get in contact with them before making a purchase.',
        [
          {
            text: 'Contact Seller',
            onPress: handleContactSeller,
          },
          {
            text: 'Go Back',
          },
        ],
      );
      return;
    } else if (buyerMarketplace && sellerMarketplace && !hasShippingAddress) {
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
      return;
    }

    if (onBuyItNow) {
      onBuyItNow(queryData.seller.id);
    }
  };

  const handleMakeOffer = () => {
    const offerParams = {
      dealId: queryData.id,
    };

    if (isMeBuyer) {
      offerParams.sellerId = queryData.seller.id;
    } else {
      offerParams.buyerId = queryData.buyer.id;
    }

    actions.navigateMakeOffer(offerParams);
  };

  const handleContactUser = () => {
    if (onMessage) {
      onMessage(
        isMeBuyer ? queryData.buyer.id : queryData.seller.id,
        isMeBuyer ? queryData.seller.id : queryData.buyer.id,
        false,
      );
    }
  };

  const handleAccept = () => {
    const offerParams = {};

    if (isMeBuyer) {
      offerParams.sellerId = queryData.seller.id;
    } else {
      offerParams.buyerId = queryData.buyer.id;
    }

    if (onAcceptOffer) {
      onAcceptOffer(offerParams);
    }
  };

  const handleRejectDeal = () => {
    const offerParams = {};

    if (isMeBuyer) {
      offerParams.sellerId = queryData.seller.id;
    } else {
      offerParams.buyerId = queryData.buyer.id;
    }

    if (onRejectOffer) {
      onRejectOffer(offerParams);
    }
  };

  const handleReject = () => {
    Alert.alert(
      'Are you sure you want to reject this offer?',
      'Not happy with the offered price? Try making a counteroffer or message them directly.',
      [
        {
          text: 'Yes',
          onPress: handleRejectDeal,
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const handleCounterOffer = () => {
    handleMakeOffer();
  };

  const handleUpdateOffer = () => {
    handleMakeOffer();
  };

  const handleUpdateDeal = () => {
    if (onRenewDeal) {
      onRenewDeal();
    }
  };

  const handleCheckout = () => {
    if (!queryData.order) {
      handleContactUser();
      return;
    }

    if (onCheckout) {
      onCheckout();
    }
  };

  const handleViewOrderDetail = () => {
    if (onViewOrderDetail) {
      onViewOrderDetail();
    }
  };

  const renderPendingMoreActions = () => {
    if (isMeBuyer) {
      if (isNoneAskingPrice) {
        return null;
      }

      const inactiveBuyNow = (buyerMarketplace && sellerMarketplace && !hasShippingAddress) || (status === Constants.userStatus.inactive);

      return (
        <Button
          style={[
            styles.backgroundButton,
            styles.leftButton,
            styles.buyNowButton,
            inactiveBuyNow && styles.inactiveButton,
          ]}
          scale={Button.scaleSize.One}
          disabled={isNoLongerAvailable}
          onPress={handleBuyNow}
        >
          <Text style={[styles.textGeneralButton, styles.textBackgroundButton]}>Buy Now</Text>
          <Text style={[styles.textSubLabel, styles.textBackgroundButton]}>
            For {totalPrice || getPrice(totalCardsPrice)}
          </Text>
        </Button>
      );
    }

    return (
      <Button
        style={[styles.backgroundButton, styles.leftButton]}
        label="Contact Buyer"
        labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
        scale={Button.scaleSize.One}
        onPress={handleContactUser}
      />
    );
  };

  const renderMakeOffer = () => {
    if (isNoLongerAvailable && !isMeBuyer) {
      return null;
    }

    return (
      <Button
        style={styles.borderButton}
        label="Make Offer"
        labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
        scale={Button.scaleSize.One}
        inactiveColor={Colors.lightGray}
        disabled={isNoLongerAvailable || !queryData.viewer.canMakeOffer}
        onPress={handleMakeOffer}
      />
    );
  };

  const renderPendingActions = () => {
    if (queryData.state !== SchemaTypes.dealState.PENDING) {
      return null;
    }

    return (
      <View style={styles.rowContainer}>
        {renderPendingMoreActions()}
        {renderMakeOffer()}
      </View>
    );
  };

  const renderOfferActions = () => {
    if (queryData.state !== SchemaTypes.dealState.OFFER_SENT) {
      return null;
    }

    if (queryData.offer?.madeBy === dealWithMe) {
      return (
        <View style={styles.rowContainer}>
          <Button
            style={styles.borderButton}
            label="Update Deal"
            labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
            scale={Button.scaleSize.One}
            onPress={handleUpdateOffer}
          />
        </View>
      );
    }

    return (
      <>
        <View style={styles.rowContainer}>
          <Button
            style={[styles.backgroundButton, styles.leftButton]}
            label="Accept"
            labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
            disabled={!queryData.viewer.canMakeOffer}
            scale={Button.scaleSize.One}
            onPress={handleAccept}
          />
          <Button
            style={[styles.borderButton, styles.rejectButton]}
            label="Reject"
            labelStyle={[styles.textGeneralButton, styles.textRejectButton]}
            scale={Button.scaleSize.One}
            onPress={handleReject}
          />
        </View>
        <Button
          style={[styles.borderButton, styles.bottomButton]}
          label="Counter Offer"
          labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
          scale={Button.scaleSize.One}
          onPress={handleCounterOffer}
        />
      </>
    );
  };

  const renderRejectActions = () => {
    if (queryData.state !== SchemaTypes.dealState.REJECTED) {
      return null;
    }

    return (
      <View style={styles.rowContainer}>
        <Button
          style={styles.borderButton}
          label="Make Offer"
          labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
          scale={Button.scaleSize.One}
          inactiveColor={Colors.lightGray}
          disabled={isNoLongerAvailable}
          onPress={handleCounterOffer}
        />
      </View>
    );
  };

  const renderAcceptActions = () => {
    if (queryData.state !== SchemaTypes.dealState.ACCEPTED && queryData.state !== SchemaTypes.dealState.COMPLETED) {
      return null;
    }

    const isCheckedOut = queryData.order && queryData.order.state !== SchemaTypes.orderState.CREATED;

    if (isMeBuyer) {
      const label = isCheckedOut ? 'View Order Detail' : queryData.order ? 'Checkout' : 'Contact Seller';
      const actionPress = isCheckedOut ? handleViewOrderDetail : queryData.order ? handleCheckout : handleContactUser;

      return (
        <View style={styles.rowContainer}>
          <Button
            style={styles.backgroundButton}
            label={label}
            labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
            scale={Button.scaleSize.One}
            disabled={!isCheckedOut && queryData.order && !queryData.seller?.orderShipmentDetails?.hasShippingAddress}
            onPress={actionPress}
          />
        </View>
      );
    }

    return (
      <View style={styles.rowContainer}>
        <Button
          style={[styles.backgroundButton, styles.leftButton]}
          label={queryData.order ? 'View Order Detail' : 'Contact Buyer'}
          labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
          scale={Button.scaleSize.One}
          onPress={queryData.order ? handleViewOrderDetail : handleContactUser}
        />
      </View>
    );
  };


  const renderCancelActions = () => {
    if (queryData.state !== SchemaTypes.dealState.CANCELLED && queryData.state !== SchemaTypes.dealState.EXPIRED) {
      return null;
    }

    if (isMeBuyer) {
      return (
        <View style={styles.rowContainer}>
          <Button
            style={styles.borderButton}
            label="Update Deal"
            labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
            scale={Button.scaleSize.One}
            onPress={handleUpdateDeal}
          />
        </View>
      );
    }

    return (
      <View style={styles.rowContainer}>
        <Button
          style={[styles.backgroundButton, styles.leftButton]}
          label="Contact Buyer"
          labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
          scale={Button.scaleSize.One}
          onPress={handleContactUser}
        />
        <Button
          style={styles.borderButton}
          label="Counter Offer"
          labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
          scale={Button.scaleSize.One}
          onPress={handleCounterOffer}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderPendingActions()}
      {renderOfferActions()}
      {renderRejectActions()}
      {renderAcceptActions()}
      {renderCancelActions()}
    </View>
  );
};

export default DealFooterActions;

const useStyle = createUseStyle(({colors}) => ({
  container: {},
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  borderButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
  },
  bottomButton: {
    flex: 0,
    marginTop: 10,
  },
  leftButton: {
    marginRight: 7,
  },
  rejectButton: {
    borderColor: Colors.red,
  },
  buyNowButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  inactiveButton: {
    backgroundColor: Colors.primaryAlpha5,
  },
  textGeneralButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    textTransform: 'capitalize',
  },
  textBackgroundButton: {
    color: Colors.white,
  },
  textBorderButton: {
    color: colors.primary,
  },
  textRejectButton: {
    color: Colors.red,
  },
  textSubLabel: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    textTransform: 'capitalize',
  },
}));
