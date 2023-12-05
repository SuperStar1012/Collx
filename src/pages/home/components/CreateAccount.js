import React from 'react';
import {Text, View} from 'react-native';

import {Button} from 'components';

import {Colors, Fonts, createUseStyle} from 'theme';

const CreateAccount = ({
  style,
  onCreate,
  isAnonymous,
}) => {
  const styles = useStyle();

  if (!isAnonymous) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textTitle}>Create a CollX Account</Text>
      <Text style={styles.textDescription}>
        Register in order to buy, sell, trade, share, and backup your
        collection.
      </Text>
      <Button
        style={styles.createButton}
        label="Create My Account"
        labelStyle={styles.textCreate}
        scale={Button.scaleSize.One}
        onPress={onCreate}
      />
    </View>
  );
};

export default CreateAccount;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.primaryCardBackground,
  },
  textTitle: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    textAlign: 'center',
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.primaryText,
    textAlign: 'center',
    marginTop: 4,
  },
  createButton: {
    height: 36,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 12,
  },
  textCreate: {
    fontWeight: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.white,
  },
}));
