import React from 'react';
import {Text, View} from 'react-native';

import {Fonts, createUseStyle} from 'theme';

const UserInfoTextInputLabel = ({
  label,
  isOptional
}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <Text style={styles.textLabel}>{label}</Text>
      {isOptional ? (
        <Text style={styles.textOptional}>(optional)</Text>
      ) : null}
    </View>
  );
};

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.056,
    color: colors.darkGrayText,
    textTransform: 'uppercase',
  },
  textOptional: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.darkGrayText,
    marginLeft: 6,
  },
}));

export default UserInfoTextInputLabel;
