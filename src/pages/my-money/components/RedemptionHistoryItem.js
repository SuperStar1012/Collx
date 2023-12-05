import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import moment from 'moment';

import HistoryState from './HistoryState';

import {Constants} from 'globals';
import {Colors, Fonts, createUseStyle} from 'theme';

const RedemptionHistoryItem = React.memo(({
  style,
  withdrawal,
}) => {
  const styles = useStyle();

  const withdrawalData = useFragment(graphql`
    fragment RedemptionHistoryItem_withdrawal on Withdrawal {
      id
      at
      status
      stripeExternalAccountLast4
      stripeFailureMessage
      value {
        formattedAmount
      }
    }`,
    withdrawal
  );

  if (!withdrawalData) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textDate}>
        {moment(withdrawalData.at).format(Constants.historyDateFormat)}
      </Text>
      <View style={[styles.rowContainer, styles.centerContainer]}>
        <Text
          style={[styles.textName, styles.textDescription]}
          numberOfLines={1}
        >
          Withdrawal
        </Text>
        <Text style={styles.textName}>
          {withdrawalData.value?.formattedAmount}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.textAccountLast4}>
          {withdrawalData?.stripeExternalAccountLast4 ? `xxxxxx${withdrawalData?.stripeExternalAccountLast4}` : null}
        </Text>
        <HistoryState state={withdrawalData.status} />
      </View>
      {withdrawalData.stripeFailureMessage ? (
        <Text style={styles.textError}>
          {withdrawalData.stripeFailureMessage}
        </Text>
      ) : null}
    </View>
  );
});

RedemptionHistoryItem.displayName = 'RedemptionHistoryItem';

export default RedemptionHistoryItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryCardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  centerContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textDate: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.grayText,
  },
  textName: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.primaryText,
    letterSpacing: -0.24,
  },
  textDescription: {
    flex: 1,
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textAccountLast4: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.grayText,
    letterSpacing: -0.08,
  },
  textError: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.red,
    letterSpacing: -0.08,
    marginTop: 4,
  },
}));
