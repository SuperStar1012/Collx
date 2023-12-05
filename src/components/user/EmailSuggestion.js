import React from 'react';
import {
  Text,
} from 'react-native';
import {Colors, Fonts, createUseStyle} from 'theme';

const EmailSuggestion = ({
  style,
  email,
}) => {
  const styles = useStyle();

  if (!email) {
    return null;
  }

  return (
    <Text style={[styles.textError, style]}>
      Did you mean <Text style={styles.textBoldError}>{email}</Text>?
    </Text>
  );
};

export default EmailSuggestion;

const useStyle = createUseStyle(() => ({
  textError: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: Colors.red,
    marginTop: 12,
  },
  textBoldError: {
    fontWeight: Fonts.bold,
  },
}));
