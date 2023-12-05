import React, {useRef} from 'react';
import {Text, View} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import ActionSheet from 'react-native-actionsheet';

import {Button} from 'components';
import OrderStatusProgressBar from './OrderStatusProgressBar';
import CopyValue from './CopyValue';

import {Fonts, createUseStyle, useTheme} from 'theme';
import {openUrl} from 'utils';
import {SchemaTypes, Urls} from 'globals';

const actionLabels = [
  'View Tracking Details',
  'Edit Tracking Code',
  'Cancel',
];

const OrderStatusTracking = ({
  style,
  isMeBuyer,
  order,
  onEditTrackingCode,
}) => {
  const styles = useStyle();
  const {t: {colors}} = useTheme();

  const actionSheetRef = useRef(null);
  const trackingCode = useRef(null);

  const orderData = useFragment(graphql`
    fragment OrderStatusTracking_order on Order {
      state
      stateGroup
      shipmentDetails {
        labelGeneratedBy
        trackingNumber
        trackingUrl
        postageLabelUrl
      }
      viewer {
        canChangeTrackingNumber
      }
      ...OrderStatusProgressBar_order
    }`,
    order
  );

  if (!orderData.state) {
    return null;
  }

  const shipmentDetails = orderData.shipmentDetails || {};
  const {canChangeTrackingNumber} = orderData.viewer || {};

  const handleTackingNumber = (value) => {
    // View Tracking Details
    if (shipmentDetails.trackingUrl) {
      handleViewTrackingDetails();
      return;
    }

    if (canChangeTrackingNumber) {
      trackingCode.current = value;
      setTimeout(() => {
        actionSheetRef.current?.show();
      });
    }
  };

  const handleViewTrackingDetails = () => {
    // View Tracking Details
    if (shipmentDetails.trackingUrl) {
      openUrl(shipmentDetails.trackingUrl);
    } else if (shipmentDetails.labelGeneratedBy === SchemaTypes.shipmentDetailsLabelGeneratedBy.SELLER && shipmentDetails.trackingNumber) {
      openUrl(`${Urls.googleSearch}?q=${shipmentDetails.trackingNumber}`);
    }
  };

  const handleSelectAction = async index => {
    switch (index) {
      case 0:
        handleViewTrackingDetails();
        break;
      case 1:
        // Edit Tracking Code
        if (onEditTrackingCode) {
          onEditTrackingCode(trackingCode.current);
        }
        break;
    }

    trackingCode.current = null;
  };

  const renderTrackingCode = () => {
    if (shipmentDetails.trackingNumber || shipmentDetails.postageLabelUrl) {
      const isVisibleTrackingAction =
        orderData.stateGroup !== SchemaTypes.orderStateGroup.DISPUTED &&
        !isMeBuyer &&
        shipmentDetails.labelGeneratedBy !== SchemaTypes.shipmentDetailsLabelGeneratedBy.SELLER;

      return (
        <View style={styles.trackingContainer}>
          <Text style={styles.textTracking}>Tracking #</Text>
          {isVisibleTrackingAction ? (
            <Button
              style={styles.trackingCodeButton}
              label={shipmentDetails.trackingNumber}
              labelStyle={styles.textTrackingCode}
              scale={Button.scaleSize.One}
              onPress={handleTackingNumber}
            />
          ) : (
            <CopyValue
              labelStyle={styles.textTrackingCodeCopy}
              value={shipmentDetails.trackingNumber}
              copyDescription="Tracking Number Copied"
              onPress={handleTackingNumber}
            />
          )}
        </View>
      );
    }

    return (
      <Text style={[styles.textTracking, styles.textDescription]}>
        This item does not have a tracking code
      </Text>
    );
  };

  if (orderData.state === SchemaTypes.orderState.CREATED || orderData.state === SchemaTypes.orderState.AWAITING_PAYMENT) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {renderTrackingCode()}
      <OrderStatusProgressBar order={orderData} />
      <ActionSheet
        ref={actionSheetRef}
        tintColor={colors.primaryText}
        options={actionLabels}
        cancelButtonIndex={actionLabels.length - 1}
        onPress={handleSelectAction}
      />
    </View>
  );
}

export default OrderStatusTracking;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textTracking: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
  textDescription: {
    color: colors.darkGrayText,
    textAlign: 'center',
  },
  trackingCodeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  textTrackingCode: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primary,
  },
  textTrackingCodeCopy: {
    color: colors.primary,
  },
}));
