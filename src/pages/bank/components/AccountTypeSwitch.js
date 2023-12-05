import React from 'react';
import {View, Text} from 'react-native';

import {
  Button,
} from 'components';

import {Fonts, createUseStyle} from 'theme';

export const bankAccountType = {
  individual: 'individual',
  company: 'company',
};

const switchActions = [
  {
    id: bankAccountType.individual,
    label: 'Individual',
  },
  {
    id: bankAccountType.company,
    label: 'Company',
  },
];

const AccountTypeSwitch = ({
  accountType,
  accountHolderType,
  isEditable = false,
  onChangeAccountType,
}) => {
  const styles = useStyle();

  const handleChangeType = (type) => {
    if (onChangeAccountType) {
      onChangeAccountType(type);
    }
  };

  const renderContent = () => {
    if (!isEditable && accountHolderType) {
      return (
        <Text style={styles.textAccountType}>{accountType}</Text>
      );
    }

    return (
      <View style={styles.switchContentContainer}>
        {switchActions.map((item, index) => (
          <Button
            key={index}
            style={[
              styles.button,
              accountType === item.id ? styles.activeButton : styles.inactiveButton,
            ]}
            label={item.label}
            labelStyle={accountType === item.id ? styles.textActiveButton : styles.textInactiveButton}
            scale={Button.scaleSize.One}
            onPress={() => handleChangeType(item.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        Account Type
      </Text>
      {renderContent()}
    </View>
  );
};

export default AccountTypeSwitch;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 20,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  switchContentContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 4,
  },
  textContentContainer: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
  },
  activeButton: {
    borderColor: colors.primary,
  },
  inactiveButton: {
    borderColor: colors.darkGrayText,
  },
  textActiveButton: {
    fontWeight: Fonts.semiBold,
    color: colors.primary,
  },
  textInactiveButton: {
    fontWeight: Fonts.semiBold,
    color: colors.darkGrayText,
  },
  textAccountType: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    marginHorizontal: 16,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
}));
