import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';

import {SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const checkmarkCircleOutlineIcon = require('assets/icons/checkmark_circle_outline.png');
const closeCircleOutlineIcon = require('assets/icons/close_circle_outline.png');
const clockArrowTwoCircleIcon = require('assets/icons/clock_arrow_two_circle.png');

const DealFooterDescription = ({
  deal,
  dealWithMe,
}) => {
  const isMeBuyer = dealWithMe === SchemaTypes.dealsWithMeAs.BUYER;

  const styles = useStyle();

  const dealData = useFragment(graphql`
    fragment DealFooterDescription_deal on Deal {
      id
      state
      cancelledBy
      offer {
        madeBy
      }
      order {
        id
        state
      }
      tradingCards {
        state
      }
    }`,
    deal
  );

  const {
    state,
    offer,
    order,
    tradingCards,
    cancelledBy,
  } = dealData || {};

  const isBuyerPending = isMeBuyer && state === SchemaTypes.dealState.PENDING;

  const isNoLongerAvailable = useMemo(() => {
    let value = false;
    tradingCards?.forEach(card => {
      if (card?.state === SchemaTypes.tradingCardState.SOLD || card?.state === SchemaTypes.tradingCardState.NOT_FOR_SALE) {
        value = true;
      }
    });

    return value;
  }, [tradingCards]);

  const currentStatus = useMemo(() => {
    const dealStates = {
      [SchemaTypes.dealState.ACCEPTED]: {
        color: Colors.green,
        label: offer?.madeBy ? `Accepted by ${offer?.madeBy === SchemaTypes.dealOfferBy.BUYER ? 'Seller' : 'Buyer'}` : 'Accepted',
        icon: checkmarkCircleOutlineIcon,
      },
      [SchemaTypes.dealState.CANCELLED]: {
        color: Colors.darkGray,
        label: 'Cancelled',
        description: cancelledBy ? `Cancelled by ${cancelledBy.toLowerCase()}` : null,
        icon: closeCircleOutlineIcon,
      },
      [SchemaTypes.dealState.EXPIRED]: {
        color: Colors.darkGray,
        label: 'Expired',
        description: 'Offer expired',
        icon: closeCircleOutlineIcon,
      },
      [SchemaTypes.dealState.COMPLETED]: {
        color: Colors.green,
        label: offer?.madeBy ? `Accepted by ${offer?.madeBy === SchemaTypes.dealOfferBy.BUYER ? 'Seller' : 'Buyer'}` : 'Accepted',
        icon: checkmarkCircleOutlineIcon,
      },
      [SchemaTypes.dealState.OFFER_SENT]: {
        color: Colors.yellow,
        label: offer?.madeBy ?
          `${offer?.madeBy === SchemaTypes.dealOfferBy.SELLER ? 'Counteroffer' : 'Offer'} ${dealWithMe === offer?.madeBy ? 'Sent' : 'Received'}`
          :
          'Offer',
        icon: clockArrowTwoCircleIcon,
      },
      [SchemaTypes.dealState.PENDING]: {
        color: Colors.yellow,
        label: 'Pending Deal',
        icon: clockArrowTwoCircleIcon,
      },
      [SchemaTypes.dealState.REJECTED]: {
        color: Colors.red,
        label: offer?.madeBy ? `Rejected by ${offer?.madeBy === SchemaTypes.dealOfferBy.BUYER ? 'Seller' : 'Buyer'}` : 'Rejected',
        icon: closeCircleOutlineIcon,
      },
    };

    return dealStates[state] || {};
  }, [state, offer, cancelledBy]);

  const renderState = () => {
    if (!currentStatus) {
      return null;
    }

    return (
      <View style={styles.stateContainer}>
        <Image
          style={[styles.iconState, {tintColor: currentStatus.color}]}
          source={currentStatus.icon}
        />
        <Text style={[styles.textState, {color: currentStatus.color}]}>
          {currentStatus.label}
        </Text>
      </View>
    );
  };

  const renderDescription = () => {
    if (state === SchemaTypes.dealState.ACCEPTED || state === SchemaTypes.dealState.COMPLETED) {
      return null;
    }

    let description = null;
    if (isMeBuyer && state === SchemaTypes.dealState.OFFER_SENT && offer?.madeBy === SchemaTypes.dealOfferBy.BUYER) {
      description = 'Waiting for the seller to approve';
    } else if (!isMeBuyer && state === SchemaTypes.dealState.PENDING) {
      description = 'Buyer hasn’t sent an offer';
    } else if (currentStatus.description) {
      description = currentStatus.description;
    }

    if (!description) {
      return null;
    }

    return <Text style={styles.textDescription}>{description}</Text>;
  };

  const renderExtraDescription = () => {
    let moreDescription = null;

    if (state === SchemaTypes.dealState.ACCEPTED || state === SchemaTypes.dealState.COMPLETED) {
      if (order?.state === SchemaTypes.orderState.CREATED || order?.state === SchemaTypes.orderState.AWAITING_PAYMENT) {
        moreDescription = `Congrats! This deal is accepted, please tap the ”${isMeBuyer && order ? 'Checkout' : isMeBuyer ? 'Contact Seller' : 'Contact Buyer'}” button below to arrange the payment and shipping details.`;
      }
    } else if (isNoLongerAvailable && !isMeBuyer) {
      moreDescription = 'Some items in this deal is no longer available. The buyer needs to remove them to continue.';
    }

    if (!moreDescription) {
      return null;
    }

    return (
      <View style={styles.extraDescriptionContainer}>
        <Text style={[styles.textDescription, styles.textMoreDescription]}>
          {moreDescription}
        </Text>
      </View>
    );
  };

  if (isBuyerPending) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.stateRowContainer}>
        {renderState()}
        {renderDescription()}
      </View>
      {renderExtraDescription()}
    </View>
  );
};

export default DealFooterDescription;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginBottom: 15,
  },
  stateRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSubtotal: {
    fontFamily: Fonts.nunitoBlack,
    fontWeight: Fonts.heavy,
    fontSize: 15,
    lineHeight: 18,
    color: colors.primaryText,
  },
  extraDescriptionContainer: {
    marginTop: 12,
  },
  textDescription: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.grayText,
    textAlign: 'right',
  },
  textMoreDescription: {
    textAlign: 'center',
  },
  stateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconState: {
    width: 24,
    height: 24,
  },
  textState: {
    fontWeight: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    marginLeft: 4,
  },
}));
