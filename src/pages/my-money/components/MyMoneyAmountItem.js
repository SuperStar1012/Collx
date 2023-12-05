import React from 'react';
import PropTypes from 'prop-types';
import {graphql, useFragment} from 'react-relay';

import MyMoneyItem from './MyMoneyItem';

import {createUseStyle} from 'theme';

const MyMoneyAmountItem = ({
  style,
  label,
  ledger,
  route,
  action,
  disabledFormat,
  onPress,
}) => {
  const styles = useStyle();

  const myLedger = useFragment(graphql`
    fragment MyMoneyAmountItem_ledger on Ledger {
      balance {
        amount
        formattedAmount
      }
    }`,
    ledger
  );

  const handlePress = (value) => {
    if (onPress) {
      onPress(value);
    }
  };

  const amount = Number(myLedger.balance.amount) || 0;

  return (
    <MyMoneyItem
      style={style}
      valueStyle={disabledFormat || amount <= 0 ? styles.textZero : styles.textNumber}
      label={label}
      value={myLedger.balance.formattedAmount}
      route={amount > 0 ? route : null}
      action={amount > 0 ? action : null}
      onPress={handlePress}
    />
  );
};

MyMoneyAmountItem.defaultProps = {
  onPress: () => {},
};

MyMoneyAmountItem.propTypes = {
  onPress: PropTypes.func,
};

export default MyMoneyAmountItem;

const useStyle = createUseStyle(({colors}) => ({
  textNumber: {
    color: colors.primary,
  },
  textZero: {
    color: colors.primaryText,
  },
}));
