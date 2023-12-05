import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {bankAccountType} from './AccountTypeSwitch';

import {Constants} from 'globals';
import {Fonts, createUseStyle} from 'theme';

const AccountHolder = ({
  accountType,
  accountName,
  accountHolderName,
  onChangeAccountName,
}) => {
  const styles = useStyle();

  const handleChangeFirstName = (name) => {
    if (onChangeAccountName) {
      onChangeAccountName({
        ...accountName,
        firstName: name,
      });
    }
  };

  const handleChangeLastName = (name) => {
    if (onChangeAccountName) {
      onChangeAccountName({
        ...accountName,
        lastName: name,
      });
    }
  };

  const handleChangeBusinessName = (name) => {
    if (onChangeAccountName) {
      onChangeAccountName({
        ...accountName,
        companyName: name,
      });
    }
  };

  if (accountHolderName) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textSectionTitle}>
          Account Name
        </Text>
        <Text style={styles.textName}>
          {accountHolderName}
        </Text>
      </View>
    );
  }

  if (accountType === bankAccountType.individual) {
    return (
      <>
        <View style={styles.sectionContainer}>
          <Text style={styles.textSectionTitle}>
            First Name
          </Text>
          <TextInput
            style={styles.textInputValue}
            autoCorrect={false}
            placeholder="First name"
            value={accountName.firstName}
            maxLength={Constants.nameMaxLength}
            underlineColorAndroid="transparent"
            onChangeText={handleChangeFirstName}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.textSectionTitle}>
            Last Name
          </Text>
          <TextInput
            style={styles.textInputValue}
            autoCorrect={false}
            placeholder="Last name"
            value={accountName.lastName}
            maxLength={Constants.nameMaxLength}
            underlineColorAndroid="transparent"
            onChangeText={handleChangeLastName}
          />
        </View>
      </>
    );
  } else if (accountType === bankAccountType.company) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textSectionTitle}>
          Business name
        </Text>
        <TextInput
          style={styles.textInputValue}
          autoCorrect={false}
          autoCapitalize="words"
          placeholder="Business name"
          value={accountName.companyName}
          maxLength={Constants.nameMaxLength}
          underlineColorAndroid="transparent"
          onChangeText={handleChangeBusinessName}
        />
      </View>
    );
  }

  return null;
};

export default AccountHolder;

const useStyle = createUseStyle(({colors}) => ({
  sectionContainer: {
    marginTop: 20,
  },
  textSectionTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  textInputValue: {
    height: 40,
    borderRadius: 2,
    color: colors.primaryText,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.secondaryCardBackground,
  },
  textName: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 4,
  },
}));
