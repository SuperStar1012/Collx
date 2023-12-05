import React from 'react';
import {View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import {Button} from 'components';

import {Styles} from 'globals';
import {createUseStyle} from 'theme';

const copyIcon = require('assets/icons/doc_on_doc.png');

const CopyValue = ({
  style,
  labelStyle,
  iconStyle,
  value,
  copyDescription,
  onPress,
}) => {
  const styles = useStyle();

  const handleCopy = () => {
    Toast.show({
      type: 'checkmark',
      text1: copyDescription,
      bottomOffset: Styles.bottomTabBarHeight,
      onPress: () => Toast.hide(),
    });

    Clipboard.setString(value);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Button
        style={styles.copyButton}
        icon={copyIcon}
        iconStyle={[styles.iconCopy, iconStyle]}
        scale={Button.scaleSize.One}
        onPress={handleCopy}
      />
      <Button
        style={styles.valueButton}
        label={value}
        disabled={!onPress}
        labelStyle={[styles.textValue, labelStyle]}
        scale={Button.scaleSize.One}
        onPress={handlePress}
      />
    </View>
  );
};

CopyValue.defaultProps = {};

CopyValue.propTypes = {};

export default CopyValue;

const useStyle = createUseStyle(({colors}) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    padding: 4,
  },
  iconCopy: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
  },
  valueButton: {},
  textValue: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.primaryText,
  },
}));
