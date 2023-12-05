import React from 'react';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {useClipboard} from '@react-native-clipboard/clipboard';

import {Fonts, createUseStyle} from 'theme';

const ClipboardCopy = props => {
  const {style, referralCode} = props;
  const [clipboard, setClipboard] = useClipboard();

  const styles = useStyle();

  const handleCopy = () => {
    setClipboard(referralCode);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.9}
      onPress={handleCopy}>
      <Text style={styles.textCode}>{referralCode}</Text>
      <Text style={styles.textDescription}>
        {clipboard === referralCode ? 'Copied!' : 'Tap to Copy'}
      </Text>
    </TouchableOpacity>
  );
};

ClipboardCopy.defaultProps = {};

ClipboardCopy.propTypes = {
  referralCode: PropTypes.string,
};

export default ClipboardCopy;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryCardBackground,
    borderRadius: 10,
  },
  textCode: {
    fontWeight: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    color: colors.primary,
  },
  textDescription: {
    fontWeight: Fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    color: colors.darkGrayText,
    marginTop: 3,
  },
}));
