import React, {useMemo, useRef} from 'react';
import {View, Alert} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';
import Mailer from 'react-native-mail';

import {
  Button,
} from 'components';

import {Constants, SchemaTypes} from 'globals';
import {Colors, Fonts, createUseStyle, useTheme} from 'theme';
import {useActions} from 'actions';
import {openUrl} from 'utils';

const exclamationIcon = require('assets/icons/exclamation.png');

const buyerActionLabels = [
  'Report Issue',
  'Contact CollX',
  'Cancel',
];
const sellerActionLabels = [
  'Report Issue',
  'Cancel Order',
  'Contact CollX',
  'Cancel',
];

const sellerMarkAsShippedLabels = [
  'I have a tracking code',
  'I shipped without tracking',
  'Cancel',
];

const OrderFooterActions = ({
  isMeBuyer,
  order,
  onMarkAsReceived,
  onMarkAsShipped,
  onMarkAsReturned,
  onAddAllToCollection,
  onDeleteAllFromCollection,
  onMessage,
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();
  const actions = useActions();

  const orderData = useFragment(graphql`
    fragment OrderFooterActions_order on Order {
      id
      state
      stateGroup
      seller {
        id
      }
      buyer {
        id
      }
      shipmentDetails {
        trackingNumber
        postageLabelUrl
      }
      viewer {
        canCardsBeMovedToCollection
        canCardsBeRemovedFromSellersCollection
        canIRequestRefund
        canIMarkAsCompleted
        packingListUrl
      }
    }`,
    order
  );

  const actionSheetRef = useRef(null);
  const actionSheetSellerShipRef = useRef(null);

  const {canIRequestRefund, canIMarkAsCompleted} = orderData.viewer || {};

  const actionSheetLabels = useMemo(() => {
    if (isMeBuyer) {
      const actionLabels = [...buyerActionLabels];

      if (canIRequestRefund) {
        actionLabels.splice(1, 0, 'Request Refund');
      }

      return actionLabels;
    }

    return sellerActionLabels;
  }, [isMeBuyer, canIRequestRefund]);

  const markAsShipped = () => {
    if (onMarkAsShipped) {
      onMarkAsShipped();
    }
  };

  const contactCollX = () => {
    // Contact CollX
    Mailer.mail(
      {
        subject: 'Need Help',
        recipients: [Constants.contactUs],
        body: '',
        isHTML: true,
      },
      (error, event) => {
        console.log('Error: ', error);
        console.log('Event: ', event);
      },
    );
  };

  const handleContactCollX = () => {
    contactCollX();
  };

  const handleAddAllToCollection = () => {
    if (onAddAllToCollection) {
      onAddAllToCollection();
    }
  };

  const handleMarkAsReceived = () => {
    Alert.alert(
      'Did you receive the items?',
      'This will complete the order and release payment.',
      [
        {
          text: 'Yes',
          onPress: handleCompleteOrder,
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const handleCompleteOrder = () => {
    if (onMarkAsReceived) {
      onMarkAsReceived();
    }
  };

  const handleMessage = () => {
    if (onMessage) {
      onMessage(
        isMeBuyer ? orderData.buyer.id : orderData.seller.id,
        isMeBuyer ? orderData.seller.id : orderData.buyer.id,
        true,
      );
    }
  };

  const handleAddTrackingCode = () => {
    if (orderData.id) {
      actions.navigateAddTrackingCode({
        orderId: orderData.id,
      });
    }
  };

  const handlePrintPackingList = () => {
    if (orderData.viewer?.packingListUrl) {
      openUrl(orderData.viewer.packingListUrl);
    }
  };

  const handleMarkAsShipped = () => {
    if (!orderData.shipmentDetails?.postageLabelUrl && !orderData.shipmentDetails?.trackingNumber) {
      setTimeout(() => {
        actionSheetSellerShipRef.current?.show();
      });
      return;
    }

    markAsShipped();
  };

  const handleMarkAsReturn = () => {
    if (onMarkAsReturned) {
      onMarkAsReturned();
    }
  };

  const handleDownloadShippingLabel = () => {
    if (orderData.shipmentDetails?.postageLabelUrl) {
      openUrl(orderData.shipmentDetails?.postageLabelUrl);
    }
  };

  const handleDeleteAllFromCollection = () => {
    if (onDeleteAllFromCollection) {
      onDeleteAllFromCollection();
    }
  };

  const handleReportProblem = () => {
    setTimeout(() => {
      actionSheetRef.current?.show();
    });
  };

  const handleSelectAction = async (index) => {
    switch (actionSheetLabels[index]) {
      case 'Report Issue': {
        // Report Issue
        if (!orderData.id) {
          break;
        }

        actions.navigateReportIssueDetail({
          forInput: {
            orderId: orderData.id,
          },
          issueType: SchemaTypes.issueType.ORDER,
          isCloseBack: true,
        });
        break;
      }
      case 'Request Refund': {
        // Request Refund for buyer
        actions.navigateReportIssueDetail({
          forInput: {
            orderId: orderData.id,
          },
          issueType: SchemaTypes.issueType.ORDER,
          issueCategory: SchemaTypes.issueCategory.REFUND_REQUEST,
          isCloseBack: true,
        });
        break;
      }
      case 'Cancel Order': {
        // Cancel Order for seller
        actions.navigateReportIssueDetail({
          forInput: {
            orderId: orderData.id,
          },
          issueType: SchemaTypes.issueType.ORDER,
          issueCategory: SchemaTypes.issueCategory.CANCEL_ORDER,
          isCloseBack: true,
        });
        break;
      }
      case 'Contact CollX': {
        // Contact CollX
        contactCollX();
        break;
      }
    }
  };

  const handleSelectSellerShipAction = async index => {
    switch (index) {
      case 0: {
        // I have a tracking code
        handleAddTrackingCode();
        break;
      }
      case 1: {
        // I shipped without tracking
        markAsShipped();
        break;
      }
    }
  };

  const renderAddTrackingCode = () => {
    if (orderData.shipmentDetails?.trackingNumber) {
      return null;
    }

    return (
      <Button
        style={[styles.button, styles.backgroundButton]}
        label="Add Tracking Code"
        labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
        scale={Button.scaleSize.One}
        onPress={handleAddTrackingCode}
      />
    );
  };

  const renderDownloadShippingLabel = () => {
    if (!orderData.shipmentDetails?.postageLabelUrl) {
      return null;
    }

    return (
      <Button
        style={[styles.button, styles.backgroundButton]}
        label={isMeBuyer ? 'Download Return Shipping Label' : 'Download Shipping Label'}
        labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
        scale={Button.scaleSize.One}
        onPress={handleDownloadShippingLabel}
      />
    );
  }

  const renderPrintPackingList = () => {
    if (!orderData.viewer?.packingListUrl) {
      return null;
    }

    return (
      <Button
        style={[styles.button, styles.borderButton]}
        label="Print Packing List"
        labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
        scale={Button.scaleSize.One}
        onPress={handlePrintPackingList}
      />
    );
  }

  // Buyer renders

  const renderBuyerActions = () => (
    <>
      {renderBuyerActionsForShipping()}
      {renderBuyerMainActions()}
    </>
  );

  const renderBuyerActionsForShipping = () => {
    if (orderData.stateGroup !== SchemaTypes.orderStateGroup.DISPUTED) {
      return null;
    }

    return renderDownloadShippingLabel();
  };

  const renderBuyerMainActions = () => {
    if (orderData.state === SchemaTypes.orderState.CANCELLED || orderData.state === SchemaTypes.orderState.REFUND_COMPLETED) {
      return null;
    } else if (orderData.state === SchemaTypes.orderState.COMPLETED) {
      if (!orderData.viewer?.canCardsBeMovedToCollection) {
        return null;
      }

      return (
        <Button
          style={[styles.button, styles.backgroundButton]}
          label="Add All To My Collection"
          labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
          scale={Button.scaleSize.One}
          onPress={handleAddAllToCollection}
        />
      );
    }

    return (
      <>
        {canIMarkAsCompleted ? (
          <Button
            style={[styles.button, styles.backgroundButton]}
            label="Mark as Received"
            labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
            scale={Button.scaleSize.One}
            onPress={handleMarkAsReceived}
          />
        ) : null}
        <Button
          style={[styles.button, styles.borderButton]}
          label="Message Seller"
          labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
          scale={Button.scaleSize.One}
          onPress={handleMessage}
        />
      </>
    );
  };

  // Seller renders

  const renderSellerActions = () => (
    <>
      {renderSellerActionsForShipping()}
      {renderSellerMainActions()}
    </>
  );

  const renderSellerActionsForShipping = () => {
    if (orderData.stateGroup === SchemaTypes.orderStateGroup.DISPUTED) {
      return null;
    }

    return (
      <>
        {renderSellerActionsForTracking()}
        {renderPrintPackingList()}
      </>
    );
  };

  const renderSellerActionsForTracking = () => {
    if (
      orderData.state === SchemaTypes.orderState.SHIPPING_DETAILS_PROVIDED ||
      orderData.stateGroup !== SchemaTypes.orderStateGroup.ORDER_PLACED
    ) {
      return renderDownloadShippingLabel();
    } else if (orderData.state === SchemaTypes.orderState.AWAITING_SHIPMENT_DETAILS) {
      return renderAddTrackingCode();
    }

    return null;
  };

  const renderSellerMainActions = () => {
    if (orderData.stateGroup === SchemaTypes.orderStateGroup.ORDER_PLACED) {
      return (
        <Button
          style={[styles.button, styles.borderButton]}
          label="Mark as Shipped"
          labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
          scale={Button.scaleSize.One}
          onPress={handleMarkAsShipped}
        />
      );
    } else if (orderData.state === SchemaTypes.orderState.DELIVERED) {
      return (
        <Button
          style={[styles.button, styles.backgroundButton]}
          label="Contact Buyer"
          labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
          scale={Button.scaleSize.One}
          onPress={handleMessage}
        />
      );
    } else if (orderData.state === SchemaTypes.orderState.COMPLETED) {
      if (orderData.viewer.canCardsBeRemovedFromSellersCollection) {
        return (
          <Button
            style={[styles.button, styles.borderButton]}
            label="Delete All From My Collection"
            labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
            scale={Button.scaleSize.One}
            onPress={handleDeleteAllFromCollection}
          />
        );
      }
    } else if (
      orderData.state === SchemaTypes.orderState.RETURN_DETAILS_PROVIDED ||
      orderData.state === SchemaTypes.orderState.RETURN_IN_TRANSIT
    ) {
      return (
        <Button
          style={[styles.button, styles.borderButton]}
          label="Mark Return as Received"
          labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
          scale={Button.scaleSize.One}
          onPress={handleMarkAsReturn}
        />
      );
    }

    return null;
  };

  const renderStateActions = () => {
    if (
      orderData.state === SchemaTypes.orderState.CREATED ||
      orderData.state === SchemaTypes.orderState.AWAITING_PAYMENT
    ) {
      return null;
    } else if (orderData.state === SchemaTypes.orderState.REFUND_REQUESTED) {
      return (
        <View style={styles.rowActionsContainer}>
          <Button
            style={[styles.button, styles.backgroundButton, styles.leftButton]}
            label="Contact CollX"
            labelStyle={[styles.textGeneralButton, styles.textBackgroundButton]}
            scale={Button.scaleSize.One}
            onPress={handleContactCollX}
          />
          <Button
            style={[styles.button, styles.borderButton]}
            label={`Message ${isMeBuyer ? 'Seller' : 'Buyer'}`}
            labelStyle={[styles.textGeneralButton, styles.textBorderButton]}
            scale={Button.scaleSize.One}
            onPress={handleMessage}
          />
        </View>
      );
    }

    return isMeBuyer ? renderBuyerActions() : renderSellerActions();
  };

  const renderReportProblem = () => {
    if (orderData.state === SchemaTypes.orderState.CANCELLED) {
      return null;
    }

    return (
      <Button
        style={styles.reportProblemButton}
        label="Report Problem"
        labelStyle={styles.textReportProblem}
        icon={exclamationIcon}
        iconStyle={styles.iconReportProblem}
        scale={Button.scaleSize.One}
        onPress={handleReportProblem}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderStateActions()}
      {renderReportProblem()}
      <ActionSheet
        ref={actionSheetRef}
        tintColor={colors.primary}
        options={actionSheetLabels}
        cancelButtonIndex={actionSheetLabels.length - 1}
        onPress={handleSelectAction}
      />
      <ActionSheet
        ref={actionSheetSellerShipRef}
        tintColor={colors.primary}
        options={sellerMarkAsShippedLabels}
        cancelButtonIndex={sellerMarkAsShippedLabels.length - 1}
        onPress={handleSelectSellerShipAction}
      />
    </View>
  );
};

export default OrderFooterActions;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
  },
  rowActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    marginTop: 16,
  },
  backgroundButton: {
    backgroundColor: colors.primary,
  },
  borderButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  leftButton: {
    marginRight: 7,
  },
  textGeneralButton: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    // textTransform: 'capitalize',
  },
  textBackgroundButton: {
    color: Colors.white,
  },
  textBorderButton: {
    color: colors.primary,
  },
  reportProblemButton: {
    alignSelf: 'center',
    height: 40,
    marginTop: 6,
  },
  textReportProblem: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  iconReportProblem: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
    marginRight: 2,
  },
}));
