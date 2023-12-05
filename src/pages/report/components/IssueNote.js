import React, {useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {Fonts, createUseStyle, useTheme} from 'theme';

const IssueNote = ({
  style,
  hiddenTitle,
  title,
  placeholder,
  onChangeText
}) => {
  const {t: {colors}} = useTheme();
  const styles = useStyle();

  const [notes, setNotes] = useState('');

  const handleChangeText = value => {
    setNotes(value);

    if (onChangeText) {
      onChangeText(value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {!hiddenTitle ? <Text style={styles.textFieldName}>{title || 'NOTES (optional)'}</Text> : null}
      <TextInput
        style={styles.textInputNote}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder={placeholder || "Additional notes..."}
        placeholderTextColor={colors.placeholderText}
        multiline
        maxLength={350}
        value={notes}
        underlineColorAndroid="transparent"
        onChangeText={handleChangeText}
      />
    </View>
  );
};

export default IssueNote;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    marginTop: 12,
  },
  textFieldName: {
    fontWeight: Fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.004,
    color: colors.darkGrayText,
  },
  textInputNote: {
    height: 110,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
    padding: 10,
    marginTop: 16,
    textAlignVertical: 'top',
    borderRadius: 2,
    backgroundColor: colors.secondaryCardBackground,
  },
}));
