import React, { useMemo } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  Button,
} from 'components';

import {Colors, createUseStyle} from 'theme';

const bankIcon = require('assets/icons/bank.png');
const ellipsisIcon = require('assets/icons/ellipsis.png');
const exclamationIcon = require('assets/icons/exclamation_circle.png');

const BankAccountItem = ({
  bank,
  disabled,
  onSelect,
  onEdit,
}) => {
  const styles = useStyle();

  const isErrored = useMemo(() => (
    bank.status === 'verification_failed' || bank.status === 'errored'
  ), [bank]);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(bank);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(bank);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      disabled={disabled || isErrored}
      onPress={handleSelect}
    >
      <View style={styles.contentContainer}>
        <Image
          style={styles.iconBank}
          source={bankIcon}
        />
        <Text style={styles.textValue}>
          {`•••• ${bank?.last4}`}
        </Text>
        {bank?.default_for_currency ? (
          <Text style={[styles.textValue, styles.textDefault]}>
            (default)
          </Text>
        ) : null}
      </View>
      {isErrored ? (
        <Image
          style={styles.iconExclamation}
          source={exclamationIcon}
        />
      ) : null}
      <Button
        style={styles.actionButton}
        icon={ellipsisIcon}
        iconStyle={styles.iconEllipsis}
        scale={Button.scaleSize.Four}
        onPress={handleEdit}
      />
    </TouchableOpacity>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
    backgroundColor: colors.primaryCardBackground,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBank: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.darkGrayText,
  },
  iconExclamation: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.red,
    marginHorizontal: 8,
  },
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginLeft: 8,
  },
  textDefault: {
    color: colors.darkGrayText,
  },
  actionButton: {},
  iconEllipsis: {
    width: 28,
    height: 28,
    tintColor: colors.grayText,
  },
}));

export default BankAccountItem;
