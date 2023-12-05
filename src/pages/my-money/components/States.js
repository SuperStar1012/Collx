import {Colors} from 'theme';
import {SchemaTypes} from 'globals';

export const WithdrawalStatusValues = {
  [SchemaTypes.withdrawalStatus.STARTED]: {
    color: Colors.yellow,
    label: 'Pending',
    icon: require('assets/icons/clock_arrow_two_circle.png'),
  },
  [SchemaTypes.withdrawalStatus.FINISHED]: {
    color: Colors.green,
    label: 'Complete',
    icon: require('assets/icons/checkmark_circle_outline.png'),
  },
  [SchemaTypes.withdrawalStatus.FAILED]: {
    color: Colors.red,
    label: 'Failed',
    icon: require('assets/icons/close_circle_outline.png'),
  },
};
