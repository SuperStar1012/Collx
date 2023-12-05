import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import {graphql, useFragment} from 'react-relay';
import moment from 'moment';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const CreditHistoryItem = React.memo(({
  style,
  ledgerEntry,
}) => {
  const styles = useStyle();

  const ledgerEntryData = useFragment(graphql`
    fragment CreditHistoryItem_ledgerEntry on LedgerEntry {
      id
      date
      description
      value {
        formattedAmount
      }
    }`,
    ledgerEntry
  );

  if (!ledgerEntryData) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textDate}>
        {moment(ledgerEntryData.date).format(Constants.historyDateFormat)}
      </Text>
      <View style={[styles.rowContainer, styles.centerContainer]}>
        <Text
          style={[styles.textName, styles.textDescription]}
          numberOfLines={1}
        >
          {ledgerEntryData.description}
        </Text>
        <Text style={styles.textName}>
          {ledgerEntryData.value?.formattedAmount}
        </Text>
      </View>
      {/* <View style={styles.rowContainer}>
        <Text style={styles.textDescription}>{ledgerEntryData.description}</Text>
        <HistoryState state={ledgerEntryData.state} />
      </View> */}
    </View>
  );
});

CreditHistoryItem.displayName = 'CreditHistoryItem';

export default CreditHistoryItem;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 13,
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
  // textDescription: {
  //   fontSize: 13,
  //   lineHeight: 18,
  //   color: colors.grayText,
  //   letterSpacing: -0.08,
  // },
}));
