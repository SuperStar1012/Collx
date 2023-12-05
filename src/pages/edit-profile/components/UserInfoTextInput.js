import React, {forwardRef} from 'react';
import {TextInput, View} from 'react-native';
import UserInfoTextInputLabel from './UserInfoTextInputLabel';

import {Fonts, createUseStyle, useTheme} from 'theme';

const UserInfoTextInput = forwardRef((props, ref) => {
  const {label, isOptional, ...otherProps} = props;

  const {t: {colors}} = useTheme();
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <UserInfoTextInputLabel
        label={label}
        isOptional={isOptional}
      />
      <TextInput
        ref={ref}
        style={styles.textInput}
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor={colors.placeholderText}
        underlineColorAndroid="transparent"
        {...otherProps}
      />
    </View>
  );
});

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginVertical: 12,
  },
  textInput: {
    height: 40,
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primaryText,
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginTop: 10,
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
}));

UserInfoTextInput.displayName = 'UserInfoTextInput';

export default UserInfoTextInput;
