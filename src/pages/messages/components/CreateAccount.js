import React from 'react';
import {View, Text} from 'react-native';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const CreateAccount = ({onCreateAccount}) => {
  const styles = useStyle();

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Create a CollX account</Text>
      <Text style={styles.textDescription}>
        Register in order to buy, sell, trade, share, and backup your
        collection.
      </Text>
      <Button
        style={styles.createAccountButton}
        label="Create My Account"
        labelStyle={styles.textCreateAccount}
        scale={Button.scaleSize.One}
        onPress={handleCreateAccount}
      />
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  textTitle: {
    fontWeight: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    color: colors.primaryText,
  },
  textDescription: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    textAlign: 'center',
    marginVertical: 12,
  },
  createAccountButton: {
    height: 40,
    width: 192,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  textCreateAccount: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white,
  },
}));

export default CreateAccount;
