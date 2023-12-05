import {Colors} from 'theme';
import SchemaTypes from './SchemaTypes';

const clockArrowIcon = require('assets/icons/clock_arrow_two_circle.png');
const checkmarkIcon = require('assets/icons/checkmark_circle_outline.png');
const closeIcon = require('assets/icons/close_circle_outline.png');
const exclamationIcon = require('assets/icons/exclamation_circle.png');

export default {
  orderStates: (colors) => ({
    [SchemaTypes.orderState.CREATED]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Order Placed',
      shortLabel: 'Pending',
      longLabel: 'Order Pending Payment',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.AWAITING_PAYMENT]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Order Placed',
      shortLabel: 'Payment Processing',
      longLabel: 'Order Payment Processing',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.AWAITING_SHIPMENT_DETAILS]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Order Placed',
      shortLabel: 'Order Placed',
      longLabel: 'Awaiting Shipment Details',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.SHIPPING_DETAILS_PROVIDED]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Ready to Ship',
      shortLabel: 'Ready to Ship',
      longLabel: 'Ready to Ship',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.TRANSFERRED_TO_CARRIER]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Shipped',
      shortLabel: 'In Transit',
      longLabel: 'Order In Transit',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.DELIVERED]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Delivered',
      shortLabel: 'Delivered',
      longLabel: 'Order Delivered',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.COMPLETED]: {
      color: colors?.alertGreenColor || Colors.softDarkGreen,
      backgroundColor: colors?.alertGreenBackground || Colors.greenAlpha1,
      groupLabel: 'Completed',
      shortLabel: 'Completed',
      longLabel: 'Order Completed',
      icon: checkmarkIcon,
    },
    [SchemaTypes.orderState.CANCELLED]: {
      color: colors?.alertBlueColor || Colors.gray,
      backgroundColor: colors?.alertBlueBackground || Colors.grayAlpha1,
      groupLabel: 'Cancelled',
      shortLabel: 'Cancelled',
      longLabel: 'Order Cancelled',
      icon: closeIcon,
      longIcon: checkmarkIcon,
    },
    [SchemaTypes.orderState.RETURN_DETAILS_PROVIDED]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Refund Requested',
      shortLabel: 'Return Created',
      longLabel: 'Return Created',
      icon: exclamationIcon,
    },
    [SchemaTypes.orderState.LOST_IN_SHIPMENT]: {
      color: colors?.alertBlueColor || Colors.red,
      backgroundColor: colors?.alertBlueBackground || Colors.redAlpha1,
      groupLabel: 'Disputed',
      shortLabel: 'Lost in Shipping',
      longLabel: 'Lost in Shipping',
      icon: exclamationIcon,
    },
    [SchemaTypes.orderState.REFUND_REQUESTED]: {
      color: colors?.alertRedColor || Colors.red,
      backgroundColor: colors?.alertRedBackground || Colors.redAlpha1,
      groupLabel: 'Disputed',
      shortLabel: 'Refund Requested',
      longLabel: 'Refund Requested',
      icon: exclamationIcon,
    },
    [SchemaTypes.orderState.REFUND_CREATED]: {
      color: colors?.alertGreenColor || Colors.softDarkGreen,
      backgroundColor: colors?.alertGreenBackground || Colors.greenAlpha1,
      groupLabel: 'Disputed',
      shortLabel: 'Refund Created',
      longLabel: 'Refund Created',
      icon: checkmarkIcon,
    },
    [SchemaTypes.orderState.RETURN_IN_TRANSIT]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Disputed',
      shortLabel: 'Return in Transit',
      longLabel: 'Return in Transit',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.RETURN_DELIVERED]: {
      color: colors?.alertYellowColor || Colors.yellow,
      backgroundColor: colors?.alertYellowBackground || Colors.lightYellow,
      groupLabel: 'Disputed',
      shortLabel: 'Return Delivered',
      longLabel: 'Return Delivered',
      icon: clockArrowIcon,
    },
    [SchemaTypes.orderState.REFUND_COMPLETED]: {
      color: colors?.alertGreenColor || Colors.softDarkGreen,
      backgroundColor: colors?.alertGreenBackground || Colors.greenAlpha1,
      groupLabel: 'Disputed',
      shortLabel: 'Refunded',
      longLabel: 'Order Refunded',
      icon: checkmarkIcon,
    },
  }),
};
